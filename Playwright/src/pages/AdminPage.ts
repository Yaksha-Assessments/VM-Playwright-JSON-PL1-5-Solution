import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model for the Admin Page
 */
export default class AdminPage {
  readonly page: Page;

  //  Locators for various elements on the Admin page
  private AdminLink: Locator;              
  private editbutton: Locator;             
  private empName: Locator;                 
  private empNameSubmit: Locator;          
  private sortUsername: Locator;          
  private sortAsc: Locator;                 
  private upgradeButton: Locator;          
  private maintitle: Locator;               
  private admindropdown: Locator;           
  private adminSearch: Locator;            
  private searchButton: Locator;            
  private userRoleElements: Locator;        
  private username: Locator;
  private usernamelist: Locator;                

  constructor(page: Page) {
    this.page = page;

    // ✅ Initialize all locators
    this.AdminLink = page.locator('text=Admin');
    this.editbutton = page.locator("(//div[@class='oxd-table-cell-actions']/button[2])[1]");
    this.empName = page.locator('input.oxd-input.oxd-input--focus');
    this.empNameSubmit = page.locator("button[type='submit']");
    this.sortUsername = page.locator("(//i[contains(@class, 'bi-sort-alpha-down')])[1]");
    this.sortAsc = page.locator("(//span[@class='oxd-text oxd-text--span'][normalize-space()='Ascending'])[1]");
    this.upgradeButton = this.page.locator("a.orangehrm-upgrade-link");
    this.maintitle = page.locator(".main-title");
    this.admindropdown = page.locator("(//div[@class='oxd-select-text oxd-select-text--active'])[1]");
    this.adminSearch = page.locator('//div[@role="option"][.//span[text()="Admin"]]');
    this.searchButton = page.locator('text= Search ');
    this.userRoleElements = page
      .locator('//div[@role="rowgroup"][2]//div[@role="cell"][3]/div');

    this.username = page.locator("//input[@autocomplete='off']");
    this.usernamelist = page.locator('//div[@role="row"]//div[@role="cell"][2]/div');
  }

  /**
   * Clicks the Admin link and the first edit button
   */
  public async AdminEdit() {
    await this.AdminLink.nth(0).click();
    await this.editbutton.click();
  }

  /**
   * Clicks Admin, then sorts usernames in ascending order,
   * waits for the sorted table, and returns all user roles
   * @returns string[] of trimmed user role texts
   */
  public async adminSortUsername(): Promise<string[]> {
    await this.AdminLink.nth(0).click();
    await this.sortUsername.click();
    await this.sortAsc.click();

    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle');

    const roles = await this.usernamelist.allTextContents();
    const trimmedRoles = roles.map(role => role.trim());

    return trimmedRoles;
  }

  /**
   * Clicks Admin, then clicks Upgrade and waits for child tab to open,
   * and returns the URL of the newly opened upgrade page
   * @returns URL of the child page
   */
  public async upgrade(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.page.waitForTimeout(2000);

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.upgradeButton.click()
    ]);

    await newPage.waitForLoadState('load');
    const childPageUrl = newPage.url();
    return childPageUrl;
  }

  /**
   * Searches for users with "Admin" role selected from dropdown,
   * clicks Search, and returns the list of user roles shown
   * @returns string[] of trimmed user roles from the search result
   */
  public async adminSearchVerify(): Promise<(string | null)[]> {
    await this.AdminLink.nth(0).click();
    await this.admindropdown.click();
    await this.adminSearch.click();
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
    const roles = await this.userRoleElements.allTextContents();
    return roles;
  }
}
