const { reloadApp } = require("detox-expo-helpers");

describe("Example", () => {
  beforeEach(async () => {
    await reloadApp();
  });

  it("should have a clock face", async () => {
    await expect(element(by.id("clockface"))).toBeVisible();
  });
});
