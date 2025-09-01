// Import necessary Playwright modules and custom page objects
import { test } from "playwright/test";
import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import AdminPage from "src/pages/AdminPage";
import buzzpage from "src/pages/buzzPage";
import { MyInfoPage } from "src/pages/MyInfoPage";
import { only } from "node:test";
let BaseUrl : string;

// Test Suite: Yaksha Functional Test Suite
test.describe("Yaksha Functional Test Suite", () => {
  let loginPage: LoginPage;
  let myinfoPage: MyInfoPage;
  let adminPage: AdminPage;
  let buzzPage: buzzpage;


  // This hook runs before each test to perform initial setup and login
  test.beforeEach(async ({ page,baseURL }) => {
    BaseUrl = baseURL||""
    await page.goto("");
    loginPage = new LoginPage(page);
    myinfoPage = new MyInfoPage(page);
    adminPage = new AdminPage(page);
    buzzPage = new buzzpage(page);
    await loginPage.performLogin(); // Perform login before each test
  });

  /*
  TS-1: Validate successful profile picture upload

  This test navigates to the "My Info" section of the application and performs
  a profile picture upload. It simulates a real user action of changing the
  profile image by:
  
  - Clicking on the "My Info" tab in the sidebar
  - Selecting the existing profile image
  - Triggering the upload option
  - Uploading a new image from the local file system
  - Saving the updated profile picture
  - Return the succesfull update msg

  The successful execution indicates that the image upload flow works correctly.
*/

  test("TS-1: Validate successful profile picture upload", async ({ page }) => {
    await myinfoPage.myinfo();
    //await page.locator("//p[contains(@class,'toast-message')]").waitFor({state : 'visible'});
    const msg = await page.locator("//p[contains(@class,'toast-message')]").innerText();
    expect(msg).toContain("Successfully Updated");
  });

  /*
  TS-2: Ensure admin can access Job Categories

  This test verifies that an admin user can successfully navigate
  to the Job Categories section from the Admin panel. It performs
  the following actions:

  - Clicks on the Admin link
  - Opens the Job sub-tab
  - Selects the Job Categories option

  The test confirms that the Job Categories page is displayed,
  indicating successful navigation.
*/

  test("TS-2: Ensure admin can access Job Categories", async ({ page }) => {
    await adminPage.AdminEdit();
    const result = await page.locator("//h6[text()='Job Categories']").innerText();
    expect(result).toContain("Job Categories");
  });

  /*
  TS-3: Verify admin username sort button toggles to ascending

  This test ensures that when the admin clicks the sort button
  for the username column, the UI updates to show the ascending
  sort state (icon change).
*/

test("TS-3: Verify admin username sort button toggles to ascending", async ({ page }) => {
  await adminPage.sortUsernamesAsc();

  // After clicking the sort option, the button should now display
  // the "ascending" sort icon (bi-sort-alpha-down) to indicate state change
  await expect(page.locator('.bi-sort-alpha-down').nth(0)).toBeVisible();
});

  /*
  TS-4: Confirm new tab opens upon clicking the 'Upgrade' button

  This test verifies that clicking the "Upgrade" button in the Admin section
  successfully opens a new browser tab (or window). It performs the following:

  - Navigates to the Admin section
  - Clicks the "Upgrade" button
  - Waits for a new tab (child page) to open
  - Retrieves the URL of the newly opened tab

  The test ensures that external upgrade navigation behaves as expected
  and the correct redirection occurs in a new tab.
*/

  test("TS-4: Confirm new tab opens upon clicking the 'Upgrade' button", async ({
    page, context
  }) => {
    await adminPage.upgrade();
    expect(context.pages().length).toBe(2);
    
  });

  /*
  TS-5: Validate tooltip visibility on hovering over 'Help' button

  This test checks the UI behavior for the 'Help' button tooltip in the
  "My Info" section. It ensures that helpful contextual information is 
  displayed when users hover over the help icon.

  The test performs the following steps:
  - Navigates to the Myinfo section 
  - Hovers over the 'Help' button located in the top bar
  - Waits briefly to allow the tooltip to appear
  - Retrieves the tooltip text using the 'title' attribute
  - Passes the text for validation to confirm tooltip visibility and content

  This ensures the presence and correctness of accessibility/help features.
*/

  test("TS-5: Validate tooltip visibility on hovering over 'Help' button", async ({
    page,
  }) => {
    await myinfoPage.helpHover();
    const tooltipText = await page.locator(
      "//div[@class='oxd-topbar-body-nav-slot']/button"
    ).getAttribute("title");
    expect(page.url()).toContain('pim/viewPersonalDetails');
    expect(tooltipText).toBe("Help");
  });

  /*
  TS-6: Confirm admin can access Module Configuration

  This test verifies that an admin user can navigate to the
  Module Configuration section. It performs the following steps:

  - Navigates to the Admin section
  - Opens the Configuration tab
  - Selects the Module sub-tab

  The test confirms that the "Module Configuration" page is displayed.
*/
test("TS-6: Confirm admin can access Module Configuration", async ({ page }) => {
  await adminPage.adminModules();
  const result = await page.locator('//h6[text()="Module Configuration"]').allInnerTexts();
  expect(result).toContain("Module Configuration");
});


  /*
  TS-7: Validate photo sharing functionality with confirmation message

  This test validates that a user can successfully share a photo post
  on the Buzz page and that the action is accompanied by a confirmation
  (in this case, the actual posted comment text).

  The test performs the following actions:

  - Navigates to the Buzz page
  - Clicks the "Share Photos" button
  - Enters a unique comment with a timestamp
  - Uploads an image file from local storage
  - Submits the post
  - Reloads the page to reflect the new post
  -

  This test ensures that the photo post functionality works correctly
  and that the user's comment is properly associated with the shared photo.
*/

  test("TS-7: Validate photo sharing functionality with confirmation message", async ({
    page,
  }) => {
    const commnt = `cmnt${Date.now()}`
    await buzzPage.SharePhotoPost(commnt);
    const commentText = await page.locator("//div[@class='orangehrm-buzz-post-body']/p[1]").allInnerTexts();
    expect(commentText.length).toBeGreaterThan(1);
    expect(commentText).toContain(commnt);
 
  });

 /*
  TS-8: Verify 'Most Commented Posts' tab selection

  This test ensures that when a user clicks the
  "Most Commented Posts" tab in the Buzz section,
  the tab is correctly activated (highlighted).

  Steps:
  - Navigates to the Buzz section
  - Clicks the "Most Commented Posts" tab
  - Verifies that the tab has the active class applied
*/

  test("TS-8:Verify 'Most Commented Posts' tab selection", async ({ page }) => {
    await buzzPage.mostcommentTab();
   const result =  await page.locator("//button[text()=' Most Commented Posts ']").getAttribute("class");
  expect(result).toBe("oxd-button oxd-button--medium oxd-button--label-warn orangehrm-post-filters-button")
  });


  /*
  TS-9: Ensure comment can be successfully added to a post

  This test verifies the functionality of adding a comment to a post 
  on the Buzz page. It confirms that the comment is submitted and 
  appears correctly in the comment list.

  The test follows these steps:

  - Navigates to the Buzz section
  - Clicks on the comment button for the first post
  - Fills in a unique comment using a timestamped message
  - Submits the comment by pressing Enter
  - Retrieves the most recent comment text
  - Collects all comment elements on the page
  - Verifies that the posted comment is present in the list

  This ensures the comment submission flow is working correctly and 
  the UI reflects the new comment as expected.
*/

  test("TS-9: Ensure comment can be successfully added to a post", async ({
    page,
  }) => {
     const commnt = `cmnt${Date.now()}`
    await buzzPage.addCommentToPost(commnt);
    await page.locator("span.orangehrm-post-comment-text").nth(0).waitFor({state:'visible'})
    const postedComment = await page.locator("span.orangehrm-post-comment-text").allInnerTexts();
    expect(postedComment.length).toBeGreaterThanOrEqual(1);
    expect(postedComment).toContain(commnt);
    
  });

  /*
  TS-10: Verify post content can be edited successfully

  This test validates that the edit functionality on a Buzz post works as expected. 
  It ensures that a user can modify the content of an existing post and that the 
  updated content is reflected in the UI.

  Test steps:
  - Navigates to the Buzz section
  - Opens the options menu for the most recent post
  - Selects the edit option
  - Clears the existing post content
  - Fills in the new predefined post content (editPostText)
  - Saves the updated post
  - Verifies that the post now displays the updated content

  The success of this test confirms that users can update their shared posts 
  and that those changes persist correctly.
*/

  test("TS-10: Verify post content can be edited successfully", async ({
    page,
  }) => {
     const commnt = `Ecmnt${Date.now()}`
    await buzzPage.editPost(commnt);
    const updatedText = await page.locator("//div[@class='orangehrm-buzz-post-body']/p").first().textContent();
    expect(updatedText?.length || 0).toBeGreaterThanOrEqual(1);
    expect(updatedText).toContain(commnt);
   
  });
});

/**
 * ------------------------------------------------------Helper Methods----------------------------------------------------
 */

// Assert that profile picture upload shows a success toast
async function assertProfilePicUploadSuccess(page: Page) {
  await expect(
    page.locator("//p[contains(@class,'toast-message')]")
  ).toContainText("Successfully Updated");
}

// Assert that Edit User header is visible on admin edit
async function assertEditUserHeaderVisible(page: Page) {
  await expect(page.locator("//h6[text()='Edit User']")).toBeVisible();
}


// Assert that tooltip text on hover is as expected


// Assert that a specific comment is present in the comment list
async function assertCommentExists(postedComment: string, cmntList: string[]) {
  expect(cmntList.some((c) => c.trim() === postedComment.trim())).toBe(true);
}

// Assert that a post was successfully edited
async function assertEditedPost(
  actualText: string,
  expectedText: string,
  page: Page
) {
  expect(actualText.trim()).toBe(expectedText.trim());
  await expect(
    page.locator("//p[contains(@class,'toast-message')]")
  ).toContainText("Successfully Updated");
}

// Assert that the list is sorted in ascending order
async function assertSortedList(actualList: string[]) {
  for (let i = 0; i < actualList.length - 1; i++) {
    if (actualList[i].localeCompare(actualList[i + 1]) > 0) {
      throw new Error(
        `List is not sorted at index ${i}: '${actualList[i]}' > '${
          actualList[i + 1]
        }'`
      );
    }
  }
}

// Test data: updated comment text for editing a post
const editPostText = "this is edit post comment";

// Expected URL when 'Upgrade' is clicked
const newPageUrl = "https://orangehrm.com/open-source/upgrade-to-advanced";

// Assert that a comment was posted correctly
async function assertCommentIsPosted(actual: string, expected: string) {
  expect(actual).toBe(expected);
}

// Assert that the number of likes increased after clicking Like
async function assertLikeCountIncreased(
  initialNumber: number,
  updatedNumber: number
) {
  expect(updatedNumber).toBeGreaterThan(initialNumber);
}

