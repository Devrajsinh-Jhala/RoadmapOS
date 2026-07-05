import { expect, test } from "@playwright/test";

test("demo user can move through the RoadmapOS flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "RoadmapOS" })).toBeVisible();
  await page.getByRole("link", { name: /start with login/i }).click();
  await expect(page.getByRole("heading", { name: /continue to your roadmap/i })).toBeVisible();
  await page.getByLabel("Name").fill("Demo Planner");
  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page.getByRole("heading", { name: /complete today's proof/i })).toBeVisible();

  await page.goto("/goals");
  await page.getByLabel("Goal title").fill("Side income validation");
  await page.getByLabel("Domain").selectOption("side-income");
  await page.getByLabel("Deadline").fill("2027-06-30");
  await page.getByLabel("Cost or corpus").fill("0");
  await page.getByLabel("Weekly hours").fill("4");
  await page.getByLabel("Priority").selectOption("2");
  await page.getByLabel("Why it matters").fill("Create optionality.");
  await page.getByRole("button", { name: /add goal/i }).click();
  await expect(page.getByText("Side income validation")).toBeVisible();

  await page.goto("/roadmap");
  await page.getByRole("button", { name: /regenerate roadmap/i }).click();
  await expect(page.getByText(/two-year vision/i)).toBeVisible();

  await page.goto("/review");
  await page.getByLabel("What completed?").fill("Skill block, health action, and expense log.");
  await page.getByLabel("What slipped?").fill("Research notes.");
  await page.getByLabel("Why did it slip?").fill("Unexpected work pressure.");
  await page.getByLabel("Saved this week").fill("8000");
  await page.getByLabel("Workouts").fill("4");
  await page.getByLabel("Study hours").fill("6");
  await page.getByLabel("Discipline score").fill("7");
  await page.getByLabel("Next-week energy").fill("Medium");
  await page.getByRole("button", { name: /save review/i }).click();
  await expect(page.getByText(/latest recovery/i)).toBeVisible();

  await page.goto("/research");
  await page
    .getByLabel("Question")
    .fill("Find a practical AI learning path for a full-stack developer in India.");
  await page.getByRole("button", { name: /run research/i }).click();
  await expect(page.getByText(/AI learning path/i)).toBeVisible();
});
