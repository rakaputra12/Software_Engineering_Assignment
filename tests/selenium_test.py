from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import time

# Initialize the Selenium WebDriver
driver = webdriver.Chrome()

try:
    print("Opening the application...")
    driver.get("http://localhost:5173")
    driver.maximize_window()
    time.sleep(2)  # Allow the page to load

    wait = WebDriverWait(driver, 10)

    # Debug city input
    print("Locating city input...")
    city_input = wait.until(EC.presence_of_element_located((By.ID, "city")))
    print(f"City input found")
    city_input.send_keys("Berlin")
    print("City input filled.")

    # Debug category select
    print("Locating category dropdown...")
    category_select = wait.until(EC.presence_of_element_located((By.ID, "category")))
    print(f"Category dropdown found")
    select = Select(category_select)
    select.select_by_visible_text("Music")
    print("Category selected.")

    # Debug radius input
    print("Locating radius input...")
    radius_input = driver.find_element(By.ID, "radius")
    print(f"Radius input found")
    radius_input.send_keys("10")
    print("Radius input filled.")

    # Debug Find Events button
    print("Locating Find Events button...")
    find_events_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Find Events')]")
    print(f"Find Events button found")
    find_events_button.click()
    print("Find Events button clicked.")
    time.sleep(2)

    # Locate an event card
    print("Locating an event card...")
    event_card = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid^='event-card']")))
    print("Event card found")

    # Debug bookmark button
    print("Locating bookmark button...")
    bookmark_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Bookmark')]")
    print(f"Bookmark button found")
    bookmark_button.click()
    print("Bookmark button clicked.")

    # Verify bookmarked events
    print("Verifying bookmarked events...")
    bookmarked_section = wait.until(
        EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Bookmarked Events')]"))
    )
    print(f"Bookmarked events section found: {bookmarked_section.text}")

    # Wait for the specific bookmarked event
    bookmarked_event = driver.find_element(By.XPATH, "//button[contains(text(), 'Remove Bookmark')]")

    print("Test Passed: Event was successfully bookmarked!")


except Exception as e:
    print(f"Test Failed: {e}")

finally:
    print("Closing the browser...")
    driver.quit()
