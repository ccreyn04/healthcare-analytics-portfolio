# Build Guide: Power BI Dashboard (click by click)

You are building this yourself so the dashboard is yours and you can explain every piece. Budget about 2 to 3 hours. Power BI Desktop is Windows only. If you are on a Mac, stop and tell Claude so you can get a different route.

## Part 1: Load the data
1. Open **Power BI Desktop** (free from the Microsoft Store).
2. Click **Get data**, then **Text/CSV**.
3. Pick `inventory_fact.csv`, click **Open**, then click **Transform Data**.
4. In the Power Query window, click the **month** column header icon and choose **Date**.
5. Click **Home > New Source > Text/CSV** and load `budget_by_site_category.csv` too.
6. Click **Close & Apply**.

## Part 2: Make the two dimension tables
1. Click **Transform data** to reopen Power Query.
2. In the left list, right-click **inventory_fact** and choose **Reference**.
3. Rename the new query to **DimSite** (double-click the name).
4. Right-click the **site** column header, choose **Remove Other Columns**.
5. Right-click the **site** header again, choose **Remove Duplicates**.
6. Repeat steps 2 to 5 for **DimCategory** using the **category** column.
7. Click **Close & Apply**.

## Part 3: Connect the tables
1. Click the **Model view** icon (left side, third icon).
2. Drag **DimSite[site]** onto **inventory_fact[site]**.
3. Drag **DimSite[site]** onto **budget_by_site_category[site]**.
4. Drag **DimCategory[category]** onto **inventory_fact[category]**.
5. Drag **DimCategory[category]** onto **budget_by_site_category[category]**.
6. Check that every line is **one-to-many** with the arrow pointing from the Dim table to the other table.

## Part 4: Add the measures
1. Click the **Report view** icon (top left).
2. Click **Home > New measure**.
3. Paste the first formula from `dax_measures.md`, press Enter.
4. Repeat for every measure in that file.

## Part 5: Page 1, "Executive Summary"
1. Add 4 **Card** visuals: Total Spend, Budget Variance %, Waste %, Stockout Events.
2. Add a **Line chart**: X-axis = month, Y-axis = Total Spend.
3. Add a **Clustered bar chart**: Y-axis = DimCategory[category], X-axis = Budget Variance $.
4. Add two **Slicers**: DimSite[site] and DimCategory[category].
5. Add a **Text box** titled "Key insights" and type the 3 headline findings from the project README in your own words.

## Part 6: Page 2, "Waste & Stockouts"
1. Click the **+** at the bottom to add a page.
2. Add a **Matrix**: Rows = DimSite[site], Columns = DimCategory[category], Values = Waste %.
3. Click the matrix, then **Format > Cell elements > Background color** and turn on conditional formatting so high waste shows red.
4. Add a **Bar chart**: Y-axis = DimCategory[category], X-axis = Stockout Events.
5. Add the same two slicers.

## Part 7: Save and publish to GitHub
1. **File > Save as**, name it `pharmacy_inventory_dashboard.pbix`.
2. **File > Export > Export to PDF** and save the PDF.
3. Take a screenshot of each page and save as `page1.png` and `page2.png`.
4. In this project folder on GitHub, add the .pbix, the PDF, and a folder called `screenshots` with the two images.
5. Check your numbers: Total Spend should show about **$6.67M** and Budget Variance % about **2.1%**. If they do not match, a relationship from Part 3 is wrong.

**Interview rule:** if you cannot explain a measure out loud, rebuild it until you can.
