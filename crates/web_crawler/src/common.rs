use anyhow::Result;
use reqwest::Url;
use scraper::{html::Html, selector::Selector};

pub fn create_url_obj(url: &str, domain: &str) -> Result<Url> {
    if !url.starts_with("http://") && !url.starts_with("https://") {
        let domain = if domain.ends_with("/") {
            domain.trim_end_matches("/")
        } else {
            domain
        };

        let relative_url = if url.starts_with("/") {
            url.trim_start_matches("/")
        } else {
            url
        };

        let url = format!("{}/{}", domain, relative_url);

        Ok(Url::parse(url.as_str())?)
    } else {
        Ok(Url::parse(url)?)
    }
}

pub fn select_hrefs(html: Html) -> Vec<String> {
    let selector = match Selector::parse("a") {
        Ok(selector) => selector,
        Err(_) => return Vec::new(),
    };

    let elements = html
        .select(&selector)
        .map(|x| x.value().attr("href"))
        .collect::<Vec<_>>();

    let mut hrefs = Vec::new();

    for element in elements {
        let href = match element {
            Some(href) => href,
            None => continue,
        };

        hrefs.push(href.to_string());
    }

    hrefs
}

pub fn should_href_be_crawled(href: &Url, origin: &Url) -> bool {
    let href_str = href.as_str();

    if href_str.is_empty() {
        return false;
    }

    if href_str.contains("javascript:")
        || href_str.contains("mailto:")
        || href_str.contains('?')
        || href_str.contains('#')
    {
        return false;
    }

    let href_domain = match href.domain() {
        Some(domain) => domain,
        None => return false,
    };

    let origin_domain = match origin.domain() {
        Some(domain) => domain,
        None => return false,
    };

    if href_domain != origin_domain {
        return false;
    }

    true
}

#[cfg(test)]
mod tests {
    use scraper::Html;

    use crate::common::{create_url_obj, select_hrefs, should_href_be_crawled};

    #[test]
    fn test_should_href_be_crawled() {
        let origin =
            create_url_obj("https://www.rust-lang.org/", "https://www.rust-lang.org").unwrap();
        let href = create_url_obj(
            "https://www.rust-lang.org/learn",
            "https://www.rust-lang.org/",
        )
        .unwrap();

        assert_eq!(should_href_be_crawled(&href, &origin), true);
    }

    #[test]
    fn test_select_hrefs() {
        let html = r#"
            <html>
                <body>
                    <a href="https://www.rust-lang.org/learn">Learn</a>
                    <a href="https://www.rust-lang.org/learn">Learn</a>
                    <a href="https://www.rust-lang.org/learn">Learn</a>
                </body>
            </html>
        "#;

        let hrefs = select_hrefs(Html::parse_document(html));
        assert_eq!(hrefs.len(), 3);
        assert_eq!(hrefs.get(1).unwrap(), "https://www.rust-lang.org/learn");
    }

    #[test]
    fn test_create_url_obj() {
        let url = "https://www.rust-lang.org/learn";
        let domain = "https://www.rust-lang.org";
        let url_obj = create_url_obj(url, domain).unwrap();
        assert_eq!(url_obj.as_str(), url);
    }

    // #[tokio::test]
    // async fn test_crawl_page() {
    //     let result = crawl_page(
    //         "https://www.rust-lang.org/",
    //         "https://www.rust-lang.org/",
    //         HashMap::new(),
    //     )
    //     .await;
    //
    //     let data = match result {
    //         Ok(data) => data,
    //         Err(error) => panic!("Error: {}", error),
    //     };
    //     println!("Data: {:?}", data);
    //     assert_eq!(data.len(), 1);
    // }
}
