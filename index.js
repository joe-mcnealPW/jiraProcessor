///////////////////////////////////////////////////////////////////////////////
//////////////////     JIRA API JSON ISSUE PROCESSOR      /////////////////////
///////////////////////////////////////////////////////////////////////////////

// Get original JSON from file
var originalJSON = require("./jiraIssueInput.json");
var fs = require("fs");

// Call processor function to take in original JSON and produce the data
// in the new JSON format.
var processedJSON = processJSON(originalJSON);

console.log(processedJSON);


fs.appendFile("jiraIssueOutput.json", JSON.stringify(processedJSON), function (err) {
  if (err) throw err;
  console.log("Saved!");
});



/*
 * @desc Processes JSON that is produced by Jira API which has multiple levels of objects
 * @return Flat JSON from Issue data which is filtered and specified by local variable values.
 */
function processJSON(originalJSON) {
  // Extract Issue array from original object
  var originalIssues = originalJSON.issues;

  // Initialize new JSON which is where the newely formatted individual objects will be pushed into
  var newJSON = [];

  // Issue Type id values that will be included in the new JSON
  var filteredIssueTypes = ["1", "2", "5"];

  // Issue object attributes to include
  var selectedAttributes = ["id", "self"];

  // Issue.fields object attributes to include
  var selectedFields = ["summary", "timetracking"];

  // Loop through array of all Issues
  for (var i in originalIssues) {
    // Extract the Issue object out of Array based on current iteration
    var currentIssue = originalIssues[i];

    // Extract Fields object from current Issue
    var currentFields = currentIssue.fields;

    // Extract Issue Type object from current Issue Fields
    var currentType = currentFields.issuetype;

    // Check to make sure the current Issue's type is included in the Issue Type filter array
    if (filteredIssueTypes.includes(currentType.id)) {
      // Initialize an empty object that will be filled with copied data from
      // orginal JSON issue and then pushed into new JSON array
      var newIssueObj = {};

      // Loop through the attributes that have been selected and copy over the values
      // from the original Issue into the new Issue object
      for (var i in selectedAttributes) {
        newIssueObj[selectedAttributes[i]] =
          currentIssue[selectedAttributes[i]];
      }

      // Loop through the attributes that have been selected to be included to be copied over
      // from the original Issues Fields into the new Issue object
      for (var j in selectedFields) {
        newIssueObj[selectedFields[j]] = currentFields[selectedFields[j]];
      }

      // Push the new Issue object into the JSON array. This object will at this point have all the data
      // copied over from the original Issue object.
      newJSON.push(newIssueObj);
    }
  }

  // Return the new JSON object after all of the original JSON data has been copied over
  // into the new JSON object in the new format
  return newJSON;
}
