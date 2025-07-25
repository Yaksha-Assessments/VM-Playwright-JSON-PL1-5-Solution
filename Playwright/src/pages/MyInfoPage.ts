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
    this.Myinfo = page.locator("text=My Info");
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
    await this.clickImage.click(); // Click on profile image
    await this.uploadButton.click(); // Trigger upload action
    await this.fileInput.setInputFiles(filePath); // Upload image from path
    await this.ImageSave.click(); // Save uploaded image
  }

  /**
   * Hovers over the help button and returns the tooltip text.
   * @returns string Tooltip text shown on hover
   */
  public async helpHover(): Promise<string> {
    await this.helpbutton.hover();
    await this.page.waitForTimeout(4000); // Wait to ensure tooltip loads

    const tooltip = await this.helpbutton.getAttribute("title");
    return tooltip ?? ""; // Return empty string if null
  }
}
