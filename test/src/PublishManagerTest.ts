import { createTargets, Platform } from "electron-builder"
import * as path from "path"
import { app, checkDirContents } from "./helpers/packTester"

const target = Platform.MAC.createTarget("zip")

test.ifDevOrLinuxCi("generic and github", app({
  targets: target,
  config: {
    publish: [
      {
        provider: "generic",
        url: "https://example.com/downloads"
      },
      {
        provider: "github",
        repo: "foo/foo"
      },
    ]
  },
}))

test.ifAll.ifNotWindows("os macro", app({
  targets: createTargets([Platform.LINUX, Platform.MAC], "zip"),
  config: {
    publish: {
      provider: "s3",
      bucket: "my bucket",
      // tslint:disable:no-invalid-template-strings
      path: "${channel}/${os}"
    }
  },
}, {
  publish: "always",
  projectDirCreated: async projectDir => {
    process.env.__TEST_S3_PUBLISHER__ = path.join(projectDir, "dist/s3")
  },
  packed: context => {
    const dir = path.join(context.projectDir, "dist/s3")
    return checkDirContents(dir)
  }
}))