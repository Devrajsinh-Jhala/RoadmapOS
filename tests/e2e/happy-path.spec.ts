import { expect, test } from "@playwright/test";

test("demo user can move through the RoadmapOS flow", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "RoadmapOS", exact: true }),
  ).toBeVisible();
  await expect(page.locator('img[src$=".gif"]')).toHaveCount(6);
  await page.getByRole("tab", { name: "Research", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Bring current facts into the plan" })).toBeVisible();
  await page.getByRole("link", { name: /start with login/i }).click();
  await expect(page.getByRole("heading", { name: /continue to your roadmap/i })).toBeVisible();
  await page.getByLabel("Name").fill("Demo Planner");
  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(
    page.getByRole("heading", { name: /your life plan, reduced to today/i }),
  ).toBeVisible();

  await page.goto("/goals");
  const addGoal = page
    .locator("details")
    .filter({ hasText: "Add one goal to the plan" })
    .first();
  await addGoal.locator("summary").click();
  const addGoalForm = addGoal.locator("form");
  await addGoalForm.getByLabel("Goal title").fill("Side income validation");
  await addGoalForm.getByLabel("Domain").selectOption("side-income");
  await addGoalForm.getByLabel("Deadline").fill("2027-06-30");
  await addGoalForm.getByLabel("Target amount (INR, optional)").fill("0");
  await addGoalForm.getByLabel("Weekly time needed (hours)").fill("4");
  await addGoalForm.getByLabel("Priority").selectOption("2");
  await addGoalForm.getByLabel("Why it matters").fill("Create optionality.");
  await addGoalForm.getByRole("button", { name: /add goal/i }).click();
  await expect(page.getByText("Side income validation")).toBeVisible();

  await page.goto("/roadmap");
  await page.getByRole("button", { name: /regenerate roadmap/i }).click();
  await expect(page.getByText("Two-year vision", { exact: true })).toBeVisible();

  await page.goto("/review");
  await page.getByLabel("What completed?").fill("Skill block, health action, and expense log.");
  await page.getByLabel("What slipped?").fill("Research notes.");
  await page.getByLabel("Why did it slip?").fill("Unexpected work pressure.");
  await page.getByLabel("Money saved this week (INR)").fill("8000");
  await page.getByLabel("Workouts completed").fill("4");
  await page.getByLabel("Study or skill hours").fill("6");
  await page.getByLabel("Discipline score (1-10)").fill("7");
  await page.getByLabel("Next-week energy").fill("Medium");
  await page.getByRole("button", { name: /save review/i }).click();
  await expect(page.getByText(/latest recovery/i)).toBeVisible();

  await page.goto("/research");
  await page
    .getByLabel("Question")
    .fill("Find a practical AI learning path for a full-stack developer in India.");
  await page.getByRole("button", { name: /run research/i }).click();
  await expect(
    page.getByRole("heading", {
      name: "Find a practical AI learning path for a full-stack developer in India.",
    }),
  ).toBeVisible();
});
