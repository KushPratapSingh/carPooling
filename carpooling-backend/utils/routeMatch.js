module.exports = (rides, { pickup, drop }) => {
    return rides.map(ride => {
      // console.log(ride.pickupLocation)
      let match = 0;
      if (ride.pickupLocation.toString().toLowerCase() === pickup.toString().toLowerCase()) match += 50;
      if (ride.dropLocation.toString().toLowerCase() === drop.toString().toLowerCase()) match += 50;
      return { ...ride._doc, matchPercentage: match };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  };
  
  // simple route matching algo 