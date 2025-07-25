import { Locator, Page } from "@playwright/test";

// ✅ Importing test data from JSON file
const data = JSON.parse(JSON.stringify(require('../Data/login.json')));

/**
 * Page Object Model class for the Login Page
 */
export class LoginPage {
  readonly page: Page;

  // ✅ Locators for login fields and actions
  private usernameInput: Locator;           // Username input field
  private passwordInput: Locator;           // Password input field
  private loginButton: Locator;             // Login button
  private loginErrorMessage: Locator;       // (To be used) Login error message
  private admin: Locator;                   // (To be used) Admin menu locator
  private logOut: Locator;                  // (To be used) Logout option locator

  /**
   * Constructor initializes all locators using the passed Playwright Page instance
   * @param page Playwright Page object for the Login page
   */
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("[name='username']");
    this.passwordInput = page.locator("[name='password']");
    this.loginButton = page.locator("button.oxd-button");
    this.loginErrorMessage = page.locator(``); 
    this.admin = page.locator('');             
    this.logOut = page.locator("");            
  }

  /**
   * Perform login with valid credentials from test data
   * - Fills in username and password
   * - Clicks the login button
   */
  async performLogin() {
    await this.usernameInput.fill(data.ValidLogin.ValidUserName);   // Fill username
    await this.passwordInput.fill(data.ValidLogin.ValidPassword);   // Fill password
    await this.loginButton.click();                                  // Click login
  }
}


module.exports= {LoginPage};
