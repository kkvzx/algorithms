const fs = require("fs");
const path = require("path");

(function init() {
  const users = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../data/users.json"), "utf-8")
  );
  const mobileDevices = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../data/mobile_devices.json"),
      "utf-8"
    )
  );
  const iotDevices = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../data/iot_devices.json"),
      "utf-8"
    )
  );

  console.log(new Date().toISOString());
  console.log(count(users, mobileDevices, iotDevices));
  console.log(new Date().toISOString());
})();

function count(users, mobileDevices, iotDevices) {
  // First Function (description below)
  // checks how many IOT DEVICES is connected to every device and saves this data in mobile_devices object[]
  const howManyIotIsConnectedToSingleDevice = () => {
    return mobileDevices.map((singleMobileDevice) => {
      const iotDevicesConnectedToSingleMobile = iotDevices.filter(
        (singleIotDevice) => singleMobileDevice.id === singleIotDevice.mobile
      ).length;
      return { ...singleMobileDevice, iotDevicesConnectedToSingleMobile };
    });
  };

  // Second Function (description below)
  // Checks how many mobile devices is connected to Single User and thanks to data from howManyIotIsConnectedToSingleDevice()
  // it calculates the sum of iot devices in every mobile devices used by a user
  const howManyMobileDevicesIsConnectedToSingleUser = (
    mobileDevicesWithIot
  ) => {
    return users.map((singleUser) => {
      const iotDevicesConnectedToSingleUser = mobileDevicesWithIot
        .filter(
          (singleMobileDevice) => singleMobileDevice.user === singleUser.id
        )
        .reduce(
          (acc, currentValue) =>
            acc + currentValue.iotDevicesConnectedToSingleMobile,
          0
        );
      return { ...singleUser, iotDevicesConnectedToSingleUser };
    });
  };

  // Third Function (description below)
  const numberOfIotDevicesUsersWithTheSameName = (usersWithTotalIot) => {
    let namesAndIotDevices = {};

    const usersNames = usersWithTotalIot.map((singleUser) => {
      return {
        ...singleUser,
        name: singleUser.name.slice(0, singleUser.name.indexOf(" ")),
      };
    });

    // Counts how many devices
    usersNames.forEach((user) => {
      namesAndIotDevices[user.name] =
        (namesAndIotDevices[user.name] || 0) +
        user.iotDevicesConnectedToSingleUser;
    });
    // saves the result as object
    let result = Object.keys(namesAndIotDevices).map((k) => {
      return {
        name: k,
        iotDevicesConnectedToUserName: namesAndIotDevices[k],
      };
    });

    return result;
  };

  // Fourth function (description below)
  const convertObjectToString = (namesWithIotDevices) => {
    const result = namesWithIotDevices.map(
      ({ name, iotDevicesConnectedToUserName }) => {
        const text = `${name} => ${iotDevicesConnectedToUserName}`;
        return text;
      }
    );
    return result;
  };

  const mobileDevicesWithIot = howManyIotIsConnectedToSingleDevice();
  const usersWithTotalIot =
    howManyMobileDevicesIsConnectedToSingleUser(mobileDevicesWithIot);
  const namesWithIotDevices =
    numberOfIotDevicesUsersWithTheSameName(usersWithTotalIot);
  const textResult = convertObjectToString(namesWithIotDevices);

  return textResult;
}

// Function counts contain four functions:
//
//-->howManyIotIsConnectedToSingleDevice()
//  This function determines how many Iot Devices is connected to a single mobile device.
// it maps over all of mobile devices and iot devices looking for matching mobile id. Later on it counts a number of iot devices for every mobile device.
// Function add up this data to object ( how many iot devices was connected ) and returns it.
//
//-->howManyMobileDevicesIsConnectedToSingleUser(mobileDevicesWithIot)
//  Function accepts modified mobileDevices object. Function follow the same pattern as howManyIotIsConnectedToSingleDevice().
// Function checks how many mobile devices is connected to Single User
// it calculates the sum of iot devices in every mobile devices used by a user
//
//-->numberOfIotDevicesUsersWithTheSameName(usersWithTotalIot)
//  Takes the data from howManyMobileDevicesIsConnectedToSingleUser and creacts new object[] with name and Total devices only
// How many iot devices have been ever owned by users with the same name
// it merges objects with repeating names and calculating sums of iot devices for everyone.
//
// -->convertObjectToString(namesWithIotDevices)
//  Function simply convert object into array of strings to match the example.

// NOTE:
//  I completed this task in four function to maximize readability.
