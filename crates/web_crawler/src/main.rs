use std::fs;

use web_crawler::{crawl_page, Config};

#[tokio::main]
async fn main() {
    let configs = Vec::from([
        Config {
            domain: "https://www.valdemarsro.dk/".to_string(),
            start_url: "https://www.valdemarsro.dk/".to_string(),
            name: "Valdemarsro".to_string(),
            skip_rules: Some(|url| url.contains("/tag/")),
            ref_skip_rules: None,
            html_skip_rules: Some(|html| !html.contains(".post-recipe")),
        },
        // Config {
        //     domain: "https://spisbedre.dk/".to_string(),
        //     start_url: format!("{}{}", "https://spisbedre.dk/", "kategorier"),
        //     name: "Spis Bedre".to_string(),
        //     skip_rules: Some(|url| !url.contains("/opskrifter/") &&
        // !url.contains("/kategorier/")),     ref_skip_rules: None,
        // },
    ]);

    for config in configs {
        let data = match crawl_page(
            config.start_url.as_str(),
            config.start_url.as_str(),
            &config,
            Box::default(),
        )
        .await
        {
            Ok(data) => data,
            Err(error) => return println!("Error: {}", error),
        };

        let collection = data
            .iter()
            .filter(|(_, x)| x.html.is_some())
            .collect::<Vec<_>>();

        println!("Final data size for html only: {:?}", collection.len());

        let dir_path = "crates/web_crawler/__generated";
        fs::create_dir_all(dir_path).expect("Failed to create directory");

        let file_path = format!(
            "{}/{}.json",
            dir_path,
            config.name.to_lowercase().replace(' ', "-")
        );

        let json = match serde_json::to_string(&collection) {
            Ok(json) => json,
            Err(error) => return println!("Error: {}", error),
        };

        fs::write(&file_path, json).expect("Unable to write file");

        println!(
            "Written data to file: {:?}",
            config.name.to_lowercase().replace(' ', "-")
        );
    }
}
