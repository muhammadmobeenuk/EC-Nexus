import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { format } from "prettier";
const read = (p) => fs.readFile(p, "utf8");
const reference = await read("prototypes/vision-v02/style.css");
const current =
  (await read("src/styles/baseline.css")) +
  (await read("src/styles/refinements.css"));
assert.equal(
  await format(reference, { parser: "css" }),
  await format(current, { parser: "css" }),
  "CSS cascade must match the v0.2 reference",
);
// Git blob IDs verified against audited commit 21af430. No archived code is executed.
const archived = {
  "prototypes/purple-local/src/app.js":
    "8db20c66e45281fc9e50a65d8dca817a9992fac1",
  "prototypes/purple-local/src/styles.css":
    "e8eb302ec33438c9fdde97bc6862a26df4a53553",
  "prototypes/vision-v02/index.html":
    "eacf3e136e4fa13b4f329f7ff0bcedb72fa8e350",
  "prototypes/vision-v02/app.js": "eba8787f20b8df2e59725a24f78ea3a78727fd39",
  "prototypes/vision-v02/refinement.js":
    "ed8f36c2343bb2ffa6033b3a8c13556985698eb6",
  "prototypes/vision-v02/style.css": "6e618526e83631765e85c7b94c6a320800fc7ba7",
};
for (const [file, expected] of Object.entries(archived)) {
  const bytes = await fs.readFile(file);
  assert.equal(
    createHash("sha1")
      .update(`blob ${bytes.length}\0`)
      .update(bytes)
      .digest("hex"),
    expected,
    `Baseline integrity: ${file}`,
  );
}
const files = await fs.readdir("dist", { recursive: true });
assert.ok(
  !files.some((f) => f.includes("prototypes")),
  "Archives must be outside the production build",
);
for (const file of files)
  if ((await fs.stat("dist/" + file)).isFile())
    assert.doesNotMatch(
      await read("dist/" + file),
      /ec-nexus-v1|localStorage|sessionStorage/,
      "Default build must not access legacy storage",
    );
console.log(
  "PASS: normalized CSS parity, archived source integrity, unchanged v0.2 reference, and archive/storage exclusion from build.",
);
