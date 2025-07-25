// Import necessary Playwright modules and custom page objects
import { test } from "playwright/test";
import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import AdminPage from "src/pages/AdminPage";
import buzzpage from "src/pages/buzzPage";
import { MyInfoPage } from "src/pages/MyInfoPage";

// Test Suite: Yaksha Functional Test Suite
test.describe("Yaksha Functional Test Suite", () => {
  let loginPage: LoginPage;
  let myinfoPage: MyInfoPage;
  let adminPage: AdminPage;
  let buzzPage: buzzpage;

  // This hook runs before each test to perform initial setup and login
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
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

  The successful execution indicates that the image upload flow works correctly.
*/

  test("TS-1: Validate successful profile picture upload", async ({ page }) => {
    await myinfoPage.myinfo();
    await expect(
      page.locator("//p[contains(@class,'toast-message')]")
    ).toContainText("Successfully Updated");
    // await assertProfilePicUploadSuccess(page);
  });

  /*
  TS-2: Ensure admin can edit user records

  This test verifies that an admin user is able to initiate the edit process
  for a user record from the Admin section. It performs the following actions:

  - Navigates to the Admin section using the Admin link
  - Clicks on the edit button corresponding to a user entry

  The test confirms that the edit user interface becomes accessible, indicating
  that the edit flow is properly triggered.
*/

  test("TS-2: Ensure admin can edit user records", async ({ page }) => {
    await adminPage.AdminEdit();
    await assertEditUserHeaderVisible(page);
  });

  /*
  TS-3: Verify admin user list sorting functionality

  This test ensures that the admin panel's sorting feature works correctly
  for the username column. It follows these steps:

  - Navigates to the Admin section and applies ascending sort on usernames
  - Retrieves the list of user roles after sorting via the page object method
  - Independently fetches the user roles from the DOM for cross-verification
  - Trims the text content to normalize spacing and formatting
  - Validates both retrieved lists to ensure correct alphabetical sorting

  This test verifies the integrity of frontend sorting behavior in the user list.
*/

  test("TS-3: Verify admin user list sorting functionality", async ({
    page,
  }) => {
    const trimmedRoles = await adminPage.adminSortUsername();
    if (trimmedRoles.length === 0) {
      expect(true).toBeFalsy();
    }
    const actualTrimmedRolesElements = await page
      .locator(".oxd-table-body .oxd-table-row >> nth=0")
      .locator('xpath=../../..//div[@role="row"]//div[@role="cell"][2]');
    const roles = await actualTrimmedRolesElements.allTextContents();
    const actualTrimmedRoles = roles.map((role) => role.trim());
    await assertSortedList(trimmedRoles);
    await assertSortedList(actualTrimmedRoles);
    console.log("✅ Admin user list sorting verified successfully");
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
    page,
  }) => {
    const childPageUrl = await adminPage.upgrade();
    await assertUpgradeTabUrl(childPageUrl);
  });

  /*
  TS-5: Validate tooltip visibility on hovering over 'Help' button

  This test checks the UI behavior for the 'Help' button tooltip in the
  "My Info" section. It ensures that helpful contextual information is 
  displayed when users hover over the help icon.

  The test performs the following steps:

  - Hovers over the 'Help' button located in the top bar
  - Waits briefly to allow the tooltip to appear
  - Retrieves the tooltip text using the 'title' attribute
  - Passes the text for validation to confirm tooltip visibility and content

  This ensures the presence and correctness of accessibility/help features.
*/

  test("TS-5: Validate tooltip visibility on hovering over 'Help' button", async ({
    page,
  }) => {
    const tooltipText = await myinfoPage.helpHover();
    await assertTooltipText(tooltipText);
  });

  /*
  TS-6: Confirm admin search functionality filters correct roles

  This test verifies the search filter functionality on the Admin page,
  specifically ensuring that selecting the "Admin" role from the dropdown
  filters and displays only users with that role.

  The test performs the following steps:

  - Navigates to the Admin section
  - Selects "Admin" from the user role dropdown filter
  - Clicks the Search button to trigger the filtering
  - Retrieves the list of user roles from the search result

  The role list is then validated to ensure all displayed users belong
  to the "Admin" role category, confirming the accuracy of search filtering.
*/
  test("TS-6: Confirm admin search functionality filters correct roles", async ({
    page,
  }) => {
    const roles = await adminPage.adminSearchVerify();
    console.log("Roles found: ", roles);
    if (roles.length === 0) {
      expect(true).toBeFalsy();
    }
    await assertAllRolesAreAdmin(roles);
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
  - Returns and logs the posted comment for validation

  This test ensures that the photo post functionality works correctly
  and that the user's comment is properly associated with the shared photo.
*/

  test("TS-7: Validate photo sharing functionality with confirmation message", async ({
    page,
  }) => {
    const commentText = await buzzPage.SharePhotoPost();
    console.log("Photo shared with confirmation message: ", commentText);

    // Assertion: Check that the submitted comment is present in the list
    const commentList = await page
      .locator("//p[contains(@class,'orangehrm-buzz-post-body-text')]")
      .allInnerTexts();
    expect(commentList).toContain(commentText);
  });

  /*
  TS-8: Verify 'Like' button increments like count

  This test ensures the functionality of the 'Like' feature on the Buzz page.
  It validates whether clicking the 'Like' button on a post correctly updates
  the like count shown to the user.

  The test performs the following steps:

  - Navigates to the Buzz section
  - Fetches the current like count on the first visible post
  - Clicks the 'Like' button
  - Retrieves the updated like count
  - Validates that the count has increased after the click

  This test confirms that the like interaction works and reflects immediately in the UI.
*/

  test("TS-8: Verify 'Like' button increments like count", async ({ page }) => {
    const { initialNumber, updatedNumber } = await buzzPage.likePost();
    await assertLikeCountIncreased(initialNumber, updatedNumber);
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
    const postedComment = await buzzPage.addCommentToPost();
    const cmntList = await page
      .locator('//div/span[text()=""]')
      .allTextContents();
    await assertCommentExists(postedComment, cmntList);
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
    const updatedText = await buzzPage.editPost();
    await assertEditedPost(updatedText, editPostText, page);
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

// Assert that the upgrade tab URL is correct
async function assertUpgradeTabUrl(childPageUrl: string) {
  expect(childPageUrl).toContain(
    "https://orangehrm.com/open-source/upgrade-to-advanced"
  );
  expect(newPageUrl).toBe(childPageUrl);
}

// Assert that tooltip text on hover is as expected
async function assertTooltipText(tooltipText: string) {
  expect(tooltipText).toBe("Help");
}

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

// Assert that all returned roles are "Admin"
async function assertAllRolesAreAdmin(roles: (string | null)[]) {
  for (const role of roles) {
    expect(role?.trim()).toBe("Admin");
  }
}
