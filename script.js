// Required modules:
const blc = require("broken-link-checker");
const readline = require('readline-sync');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const performance = require('perf_hooks').performance;

// This variable keeps track of websites already visited (avoids loops):
var explored = new Set([]);

/**
 * This variable stores excluded keywords.
 * Website URLs that contain this keyword are not added to queue.
 */
var excludedKeywords = [];

// These variables keep track of collected data and may be used for output:
var max = 0; // <--- Max links ever on queue for a single run of the script.
var currentPage = "" // <--- The current page being checked (used for output to CSV).
var checkedTemp = 0; // <--- Number of links checked per URL. Resets with each URL on queue
var brokenTemp = 0; // <--- Number of broken links found per URL. Resets with each URL on queue
var checked = 0; // <--- Total number of links checked all URL's. Does not reset.
var broken = 0; // <--- Total number of broken links found across all URL's. Does not reset.
var data = []; // <--- URL, # of links checked, # of links broken, broken URLs.
var URLlist = []; // <--- List of sub-pages found for the starting URLs.

// These variables may be used to give extra parameters to the htmlChecker (not needed):
var options = {};
var customData = {};

/**
 * Defines an instance of the broken-link-checker. Calling the .enqueue() function on 
 * a URL will crawl that initial page for broken links, store the results in a variable, 
 * and recursively call the .enqueue() function on found links that contain that URL.
 */
const htmlChecker = new blc.HtmlUrlChecker(options, {
    end: () => {
        console.log("\nEND");
        console.log("Total pages checked:", explored.size);
        console.log("Total links checked:", checked);
        console.log("Search took", (performance.now() / 1000.0) / 60.0, "minutes");
        console.log("Found", broken, "broken links.\n");
        const brokenLinks = new createCsvWriter({
            path: readline.question("Please enter the desired name for the broken links file (should end in \'.csv!\')\n"),
            header: [
                {id: 'parent', title: 'Parent URL'},
                {id: 'error', title: 'Error'},
                {id: 'broken', title: 'Broken Link'},
            ]
        });
        const websiteList = new createCsvWriter({
            path: readline.question("Please enter the desired name for the website list file (should end in \'.csv!\')\n"),
            header: [
                {id: 'parent', title: 'Searched URL'},
            ]
        });
        brokenLinks
            .writeRecords(data)
            .then(() => {
                console.log('The CSV file containing the broken links was written successfully!');
                return Promise.resolve(brokenLinks);
            })
            .then(() => {
                
            })
            .catch((reason) => {
                console.log('Could not write broken links file (' + reason + ').')
            });
        
        websiteList
            .writeRecords(URLlist)
            .then(() => {
                console.log('The CSV file containing the website list was written successfully!');
                return Promise.resolve(websiteList);
            })
            .catch((reason) => {
                console.log('Could not write broken links file (' + reason + ').')
            });
    },
    error: (error) => {
        console.log(error);
    },
    html: (tree, robots, response, pageURL, customData) => {
        checkedTemp = 0;
        brokenTemp = 0;
        console.log(" ");
        console.log("Checking: ", pageURL);
        currentPage = pageURL;
        URLlist.unshift({ parent: pageURL});
        //console.log("URLlist:", URLlist)
    },
    queue: () => {
        // console.log("QUEUE");
    },
    junk: (result, customData) => {
        // console.log("JUNK", result.url.resolved);
        // console.log(" ");
    },
    link: (result, customData) => {
        checked++;
        checkedTemp++;
        console.log("Checking:", result.url.resolved)
        if (result.broken) {
            console.log(result.brokenReason);
            data.unshift({
                parent: currentPage,
                error: result.brokenReason,
                broken: result.url.resolved,
            })
            broken++;
            brokenTemp++;
            //=> HTTP_404
        } 
        else if (result.excluded) {
            console.log(result.excludedReason);
            //=> BLC_ROBOTS
        } 
        else {
            excluded = false;
                for (i in excludedKeywords) {
                if (JSON.stringify(result.url.resolved).includes(excludedKeywords[i])) {
                    excluded = true;
                    // console.log(kw);
                    // console.log(excluded);
                }
            }
            if (JSON.stringify(result.url.resolved).includes(start) && 
                !explored.has(result.url.resolved) && !excluded) {
                // console.log("On queue: ", numPages());
                // console.log("Contains excludedKeywords:", excluded);
                console.log("Adding to queue...");
                explored.add(result.url.resolved);
                addToQueue(result.url.resolved);
                max = Math.max(max, numPages());
            }
            else {
                console.log("OK!");
            }
        }
        //console.log(" ");
    },
    page: (error, pageURL, customData) => {
        console.log("Links checked:", checkedTemp)
        console.log("Broken:", brokenTemp);
        console.log("On queue: ", numPages());
    }
})

//  Helper function to recursively add new URLs to the broken-link-checker instance.
const addToQueue = (url) => {
    htmlChecker.enqueue(url, customData);
}

// Helper function to return the number of pages on the broken-link-checker's queue.
const numPages = () => {
    return htmlChecker.numPages();
}

// This variable uses the readline-sync library to get user input and store it.
let start = readline.question("Please enter a URL to scan for broken links...\nSTART: ");
explored.add(start); // <--- Add the starting URL to explored (avoids loops).

/**
 * This loop gets input for excluded keywords.
 * Continues getting input until the input is .
 */
let excluded = ""
console.log("\nEnter excluded keywords (optional). URLs that contain these keywords are not added to queue");
console.log("Press ENTER after each keyword.");
console.log("Press ENTER twice after the last keyword to begin search.");
do {
    excluded = readline.question("");
    if (excluded != "" && excluded != "\n") {
        excludedKeywords.unshift(excluded);
    }
}
while (excluded != "" && excluded != "\n");

/** Initializes excludedKeywords option if it is not empty. */
if (excludedKeywords.length > 0) {
    options = {
        excludedKeywords: excludedKeywords
    }
}

console.log(options);


htmlChecker.enqueue(start, customData); // Start the broken-link-checker instance.


