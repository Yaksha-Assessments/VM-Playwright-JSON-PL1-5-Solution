import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model for the Admin Page
 */
export default class AdminPage {
  readonly page: Page;
  private jobbtn : Locator;
  private jobCatbtn: Locator;

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
  private configTab:Locator;
  private modulesubTab : Locator;               

  constructor(page: Page) {
    this.page = page;
    this.jobbtn = page.locator("//span[text()='Job ']");
    this.modulesubTab = page.locator("//a[text()='Modules']");
    this.configTab= page.locator("//span[text()='Configuration ']");
    this.jobCatbtn = page.locator("//a[text()='Job Categories']");
    

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
   * Click the Admin tab, then the Job sub-tab, and finally the Job Categories sub-tab ;
   */
  public async AdminEdit() {
    await this.AdminLink.nth(0).click();
    await this.jobbtn.click();
    await this.jobCatbtn.click();
    await this.page.waitForLoadState('networkidle');
   
  }

 /**
 * Opens Admin → clicks username sort → applies ascending.
 * Button/icon should switch to ascending state.
 */
  public async sortUsernamesAsc() {
    await this.AdminLink.nth(0).click();
    await this.sortUsername.click();
    await this.sortAsc.click();

    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clicks Admin, then clicks Upgrade and waits for child tab to open,
   * the URL of the newly opened upgrade page
   */
  public async upgrade() {
    await this.AdminLink.nth(0).click();
    await this.page.waitForTimeout(2000);

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.upgradeButton.click()
    ]);
    
  }

 /**
 * Selects "Admin" from the role dropdown, clicks Search,
 * and returns the list of user roles from results.
 */
  public async adminModules(){
    await this.AdminLink.nth(0).click();
    await this.page.waitForTimeout(1000);
    await this.configTab.click();
    await this.modulesubTab.click();
    await this.page.waitForTimeout(1000);
  
  }
}
