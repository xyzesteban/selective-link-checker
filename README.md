# selective-link-checker
This program recursively scans a website and outputs all found sub-pages and their broken links into two different CSV files.

<h4>Introduction</h4>
<p>This project is a <strong>Javascript + NodeJS</strong> console script to find broken links in a website and its sub-pages and output them to a CSV file. I worked on this project as part of my internship with Harvard T.H. Chan School of Public Health, in order to find outdated links and information. The script uses <a href="https://github.com/stevenvachon/broken-link-checker">Steven Vachon's broken-link-checker</a> as a dependency to scrape and navigate URLs and to add links to the queue.</p>

<h4>Instructions</h4>
<p>You do not need an IDE in order to use this application, but you do need to install NodeJS and npm. You can find the latest installers <a href="https://nodejs.org/en/download/">here</a> Once you have installed NodeJS and npm, follow the next steps:</p>
<ol>
  <li><strong>Download or clone</strong> this repository into a folder on your computer.</li>
  <li><strong>Navigate to the folder</strong> that contains the repository's files.</li>
  <li><strong>Open a terminal</strong> on that folder:
  <ul>
    <li>Windows: <strong>Shift + Click</strong> on the file explorer and select "Open Command Prompt window here" or "Open PowerShell window here".</li>
    <li>macOS: Head into System Preferences and select Keyboard > Shortcuts > Services. Find "New Terminal at Folder" in the settings and click the box.<strong> Right click</strong> on the folder and select "Open Terminal".</li>
  </ul>
  </li>
  <li>On the terminal, type <code>npm ci</code> and press Enter to install dependencies. <strong>Do not use <code>npm install</code> as that will edit the package-lock.json file and install the wrong dependencies</strong></li>
  <li>On the terminal, type <code>npm run slc</code> and press Enter to start the application.</li>
  <li><strong>Type or paste the starting URL</strong> for the website you would like to check, e.g. <code>https://www.korg.com/us/products/software/kc_triton/</code> and press <strong>Enter</strong>. NOTE: Only website URLs that contain this original URL get added to the queue.</li>
  <li><strong>Type excluded keywords</strong> and press <strong>Enter</strong> after each keyword. NOTE: When checking if a link/sub-page is broken, the program will look for these keywords on the URL as a string and will not enqueue URLs that contain them.</li>
  <li>After the last keyword, <strong>press Enter</strong> a second time to start the search.</li>
  <li>Once the search is completed, <strong>Type or paste the filepath</strong> for the CSV files to be exported. NOTE: This should include both the path and the filename and should end in '.csv'; e.g. <code>C:\Users\xyzes\Documents\BrokenLinks.csv</code>. The first file will contain all the broken links found per sub-page, and the second file will contain all the websites that were in the queue during the search.</li>
</ol>

<h4>Roadmap</h4>
<div>
  <ol> 
    <li>A user-friendly <strong>web interface</strong> to interact with the application.</li>
    <li><strong>WordPress</strong> integration to output information about title, authors, editors, and timelines.</li>
  </ol>
</div>
