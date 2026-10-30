#!/usr/bin/env node
"use strict";

const { snapshot } = require("../src/dashboard.js");

const s = snapshot();
console.log(JSON.stringify(s, null, 2));
