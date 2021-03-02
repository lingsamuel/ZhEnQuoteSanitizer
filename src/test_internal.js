const importing = (sourceFile, tests) => eval(`
${require('fs').readFileSync(sourceFile)};
(${String(tests)})();`);

importing(__dirname + '/sanitizer.js', () => {
    console.log(openQuotingCn("“中”", 0))
    console.log(openQuotingCn("“中文长句”", 0))
    console.log(openQuotingCn("“中文“en”长句”", 0))
    console.log(openQuotingCn("“中文“en”长句”", 3) == false)
    console.log(openQuotingCn("““en””", 0) == false)
});
