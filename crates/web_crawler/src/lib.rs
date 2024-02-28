mod common;

use std::collections::HashMap;

use anyhow::Result;
use async_recursion::async_recursion;
use scraper::Html;
use serde::Serialize;

use crate::common::{create_url_obj, select_hrefs, should_href_be_crawled};

#[derive(Debug, PartialEq, Serialize)]
pub struct Page {
    pub url: String,
    pub url_ref: String,
    pub hits: usize,
    pub html: Option<String>,
}

#[derive(Debug, PartialEq)]
pub struct Config {
    pub domain: String,
    pub start_url: String,
    pub name: String,
    pub skip_rules: Option<fn(url: &str) -> bool>,
    pub ref_skip_rules: Option<fn(url: &str) -> bool>,
    pub html_skip_rules: Option<fn(html: &str) -> bool>,
}

#[async_recursion]
pub async fn crawl_page(
    url: &str,
    url_ref: &str,
    config: &Config,
    mut data: Box<HashMap<String, Page>>,
) -> Result<Box<HashMap<String, Page>>> {
    let url_obj = match create_url_obj(url, config.domain.as_str()) {
        Ok(url_obj) => url_obj,
        Err(_) => return Ok(data),
    };

    let url_ref_obj = match create_url_obj(url_ref, config.domain.as_str()) {
        Ok(url_ref_obj) => url_ref_obj,
        Err(_) => return Ok(data),
    };

    //TODO: remove
    // if data.len() > 10 {
    //     return Ok(data);
    // }

    let res = match reqwest::get(url_obj.as_str()).await {
        Ok(res) => res,
        Err(_) => return Ok(data),
    };

    if !res.status().is_success() {
        println!("Failed to fetch: {}", url_obj.as_str());
        return Ok(data);
    }

    let html_str = match res.text().await {
        Ok(html_str) => html_str,
        Err(_) => return Ok(data),
    };

    let html = Html::parse_document(html_str.as_str());

    let skip_html_rule = match config.html_skip_rules {
        Some(skip_html_rule) => skip_html_rule(html_str.as_str()),
        None => false,
    };

    let page = Page {
        url: url_obj.to_string(),
        url_ref: url_ref_obj.to_string(),
        hits: 1,
        html: if skip_html_rule { None } else { Some(html_str) },
    };

    println!(
        "{} url: {}",
        if skip_html_rule { "Skipping" } else { "Using" },
        url_obj.as_str()
    );

    data.insert(url_obj.as_str().to_string(), page);

    println!("Data size: {:?}", data.len());

    let hrefs = select_hrefs(html);

    for href in hrefs {
        let href_obj = match create_url_obj(href.as_str(), config.domain.as_str()) {
            Ok(href_obj) => href_obj,
            Err(_) => continue,
        };

        if !should_href_be_crawled(&href_obj, &url_obj) {
            continue;
        }

        if let Some(skip) = config.skip_rules {
            if skip(href_obj.as_str()) {
                continue;
            }
        }

        if let Some(ref_skip) = config.ref_skip_rules {
            if ref_skip(href_obj.as_str()) {
                continue;
            }
        }

        let page = data.get(href_obj.as_str());

        if let Some(page) = page {
            data.insert(
                href_obj.as_str().to_string(),
                Page {
                    url: page.url.to_string(),
                    url_ref: page.url_ref.to_string(),
                    hits: page.hits + 1,
                    html: page.html.clone(),
                },
            );
            continue;
        };

        data = match crawl_page(href_obj.as_str(), url_obj.as_str(), config, data).await {
            Ok(data) => data,
            Err(error) => panic!("Error: {}", error),
        };
    }

    Ok(data)
}
