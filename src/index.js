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

  // console.log(new Date().toISOString());
  console.log(count(users, mobileDevices, iotDevices));
  // console.log(new Date().toISOString());
})();

function count(users, mobileDevices, iotDevices) {
  // checks how many IOT DEVICES is connected to every device and saves this data in mobile_devices object[]
  const howManyIotIsConnectedToSingleDevice = () => {
    return mobileDevices.map((singleMobileDevice) => {
      const iotDevicesConnectedToSingleMobile = iotDevices.filter(
        (singleIotDevice) => singleMobileDevice.id === singleIotDevice.mobile
      ).length;
      return { ...singleMobileDevice, iotDevicesConnectedToSingleMobile };
    });
  };

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

  // Takes the data from howManyMobileDevicesIsConnectedToSingleUser and creacts new object[] with name and Total devices only
  // How many iot devices have been ever owned by users with the same name
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
    // saves the result
    let result = Object.keys(namesAndIotDevices).map((k) => {
      return {
        name: k,
        iotDevicesConnectedToUserName: namesAndIotDevices[k],
      };
    });

    return result;
  };

  const mobileDevicesWithIot = howManyIotIsConnectedToSingleDevice();
  const usersWithTotalIot =
    howManyMobileDevicesIsConnectedToSingleUser(mobileDevicesWithIot);

  const namesWithIotDevices =
    numberOfIotDevicesUsersWithTheSameName(usersWithTotalIot);

  return namesWithIotDevices;
}
