/**
 * Define as Library for storing our data
 */

// Dependencies
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");


// Define container for the module
const lib = {};

// Define the base directory for the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// Write data to file
lib.create = (dir, file, data, callback) => {
  // Open file for writing onto it.
  fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", (err, fd) => {
    if (!err && fd) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // Write the data to file and close it.
      fs.writeFile(fd, stringData, (err) => {
        if (!err) {
          fs.close(fd, (err) => {
            if (!err) {
              callback(false)
            } else {
              callback("Error closing the file", err)
            }
          })
        } else {
          callback("Error writing to new file")
        }
      })
    } else {
      callback("Could not create new file, it may already exist");
    }
  })
};

// Read data from a file
lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", (err, data) => {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData)
    } else {

      callback(err, data);
    }
  });
};
// Update data in a file
lib.update = (dir, file, data, callback) => {
  // Open the file for writing 
  fs.open(lib.baseDir + dir + "/" + file + ".json", "r+", (err, fd) => {
    if (!err && fd) {

      // Stringify the data
      const stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fd, (err) => {
        if (!err) {

          // Write to the file and close it
          fs.writeFile(fd, stringData, (err) => {
            if (!err) {
              fs.close(fd, (err) => {
                if (!err) {
                  callback(false)
                } else {
                  callback("Error closing existing file")
                }
              })
            } else {
              callback("Error writing to the file")
            }
          })
        } else {
          callback("Error truncating file.")
        }
      })
    } else {
      callback("Could not open file for updating")
    }
  })
}

// Delete a file
lib.delete = (dir, file, callback) => {

  // Unlink the file.
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false)
    } else {
      callback("Error deleting existing file");
    }
  })
}

// Export the module
module.exports = lib;