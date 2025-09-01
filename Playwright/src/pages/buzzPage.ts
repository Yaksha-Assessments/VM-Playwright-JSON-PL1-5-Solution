import { Page, Locator, expect } from "@playwright/test";
import path from "path";

// ✅ Define file path for the image to be uploaded
const filePath = path.resolve(__dirname, "../../TestImage.jpg");

/**
 * Page Object Model for Buzz Page interactions.
 */
export default class buzzPage {
  readonly page: Page;
  private mostCmntTab: Locator;

  // Locators used in Buzz Page
  private buzzLink: Locator;
  private cmnt: Locator;
  private sharephoto: Locator;
  private buzzImage: Locator;
  private submitButton: Locator;
  private successMessage: Locator;
  private photoComment: Locator;
  private firstPostFooter: Locator;
  private likeCount: Locator;
  private likeButton: Locator;
  private commentInput: Locator;
  private firstCommentButton: Locator;
  private latestComment: Locator;
  private editToggle: Locator;
  private editButton: Locator;
  private postEdit: Locator;
  private postButton: Locator;
  private verifyCmnt: Locator;
  constructor(page: Page) {
    this.page = page;
    this.mostCmntTab= page.locator("//button[text()=' Most Commented Posts ']");
    this.buzzLink = page.locator("span.oxd-main-menu-item--name", {
      hasText: "Buzz",
    });
    this.sharephoto = page.locator(
      "//button[normalize-space()='Share Photos']"
    );
    this.buzzImage = page.locator('//input[@type="file"]');
    shareButton: () =>
      this.page.locator(
        "button.oxd-button.oxd-button--medium.oxd-button--main",
        { hasText: "Share" }
      );
    this.submitButton = page.locator("//button[@type='submit']");
    this.successMessage = page.locator(
      "//p[@class='oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text']"
    );
    this.photoComment = page.locator(
      '//textarea[@placeholder="What\'s on your mind?"]'
    );

    this.firstPostFooter = page
      .locator("div.orangehrm-buzz-post-footer")
      .first();
    this.likeCount = this.firstPostFooter.locator('p:has-text("like")');
    this.likeButton = this.page.locator("(//div[@class='orangehrm-buzz-post-actions'][1]/div)[1]/../..//div[contains(@class,'orangehrm-buzz-stats-row')][1]/p");
    this.commentInput = this.page.locator(
      '[placeholder="Write your comment..."]'
    );
    this.firstCommentButton = this.page
      .locator("//div[@class='orangehrm-buzz-post-actions']/button[1]")
      .first();
    this.latestComment = this.page.locator(
      "//div[@class='orangehrm-post-comment-area'] / span[@class='oxd-text oxd-text--span orangehrm-post-comment-text']"
    );

    this.editToggle = page.locator("(//button[@type='button'])[9]");
    this.editButton = page.locator(
      "//li[@class='orangehrm-buzz-post-header-config-item'][2]"
    );
    this.postEdit = this.page.locator(
      "(//textarea[@class='oxd-buzz-post-input'])[2]"
    );
    this.postButton = this.page.locator(
      "//div[@class = 'oxd-form-actions orangehrm-buzz-post-modal-actions']/button"
    );
    this.verifyCmnt = this.page.locator(
      "//div[@class='orangehrm-buzz-post-body']/p"
    );
    this.cmnt = this.page.locator(
      "//textarea[@placeholder='What's on your mind?']"
    );
  }

  /**
   * Uploads a photo post and returns the success message text.
   */
  async SharePhotoPost(editcmnt: string){
    await this.buzzLink.click();
    await this.page.waitForTimeout(1500);
    await this.sharephoto.click();
    await this.photoComment.nth(1).fill(editcmnt);
    await this.buzzImage.setInputFiles(filePath);
    await this.submitButton.nth(1).click();
    await this.buzzLink.waitFor({state:'visible'});
   // await this.page.waitForTimeout(5000);
    await this.buzzLink.click();
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
   
  }

  /**
 * Opens the Buzz page and clicks on the
 * "Most Commented Posts" tab.
 *
 * Expected: Tab becomes active (highlighted).
 */

 async mostcommentTab(){
  await this.buzzLink.click();
  await this.mostCmntTab.click();

 }

  /**
   * Adds a timestamped comment to the first post and returns the posted comment.
   */
  async addCommentToPost(commentText : string) {
    await this.buzzLink.click();
    await this.page.waitForTimeout(2000);
    await this.firstCommentButton.scrollIntoViewIfNeeded();
    await this.firstCommentButton.click();
    await this.commentInput.fill(commentText);
    await this.commentInput.press("Enter");
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
   
  }

  /**
   * Edits the most recent post using predefined edit text and returns the updated post text.
   */
  public async editPost(editPostText:string) {
    await this.buzzLink.click();
    await this.editToggle.click();
    await this.editButton.click();
    await this.postEdit.clear();
    await this.postEdit.fill(editPostText);
    await this.postButton.click();
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }
}

// ------------ Helper Functions ------------

/**
 * Appends a timestamp to a comment to ensure uniqueness.
 * @param comment - Base comment text
 * @returns string - Timestamped comment
 */


//-----------------helper methods----------------
// ✅ Static comment and edit post text for testing
const commentText = "this is test comment";
const editPostText = "this is edit post comment";
