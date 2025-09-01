import { Locator, Page } from "@playwright/test";
import path from "path";

// ✅ Resolving the path to the image used for upload
const filePath = path.resolve(__dirname, "../../TestImage.jpg");

/**
 * Page Object Model for the "My Info" section of the application.
 */
export class MyInfoPage {
  readonly page: Page;

  //  Locators for elements in the My Info section
  private Myinfo: Locator;
  private clickImage: Locator;
  private uploadButton: Locator;
  private fileInput: Locator;
  private ImageSave: Locator;
  private helpbutton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Myinfo = page.locator("//span[text()='My Info']");
    this.clickImage = page.locator(".employee-image");
    this.uploadButton = page.locator(".employee-image-action");
    this.fileInput = page.locator('input[type="file"].oxd-file-input');
    this.ImageSave = page.locator("button[type='submit']");
    this.helpbutton = page.locator(
      "//div[@class='oxd-topbar-body-nav-slot']/button"
    );
  }

  /**
   * Navigates to My Info, uploads a profile image, and saves it.
   */
  async myinfo() {
    await this.Myinfo.click(); // Open My Info tab
    await this.clickImage.waitFor({state:'visible'})
    await this.clickImage.click(); // Click on profile image
    await this.uploadButton.click(); // Trigger upload action
    await this.fileInput.setInputFiles(filePath); // Upload image from path
    await this.ImageSave.click(); // Save uploaded image
  }

  /**
   * Navigate to the My Info tab and Hover over the help button to verify the tooltip text.
   */
  public async helpHover() {
    await this.Myinfo.click();
    await this.page.waitForTimeout(1500);
    await this.helpbutton.hover();
    await this.page.waitForLoadState('networkidle'); // Wait to ensure tooltip loads
  }
}
