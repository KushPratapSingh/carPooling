const Ride = require('../models/Ride');
const routeMatch = require('../utils/routeMatch');

exports.createRide = async (req, res) => {
  try {
    // console.log(req.body);
    const ride = await Ride.create({ ...req.body, driver: req.user.id });
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.searchRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'available' });
    console.log(req.query)
    const matches = routeMatch(rides, req.query);
    // console.log(matches)
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.requestToJoinRide = async (req, res) =>{
  try {
    // console.log('called')
    const ride = await Ride.findById(req.params.rideId);
    console.log(ride);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    console.log(ride.joinRequests)
    // Check if already requested or already a rider
    if (ride.joinRequests.includes(req.user.id) || ride.approvedRiders.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already requested or joined' });
    }

    ride.joinRequests.push(req.user.id);
    await ride.save();
    console.log(ride);

    res.status(200).json({ message: 'Join request sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveRider = async (req, res) =>{
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.driver.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    const riderId = req.body.riderId;

    // Check if user is in pending list
    if (!ride.joinRequests.includes(riderId))
      return res.status(400).json({ message: 'No such pending request' });

    // Move from pendingRequests to riders
    ride.joinRequests = ride.joinRequests.filter(id => id.toString() !== riderId);
    ride.approvedRiders.push(riderId);
    await ride.save();

    res.status(200).json({ message: 'Rider approved successfully', ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.handleRequest = async (req, res) => {
  try {
    const { rideId, requestId, decision } = req.body;

    if (!rideId || !requestId || !decision)
      return res.status(400).json({ message: 'Invalid request' });

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const isRequested = ride.joinRequests.some(id => id.toString() === requestId);
    if (!isRequested)
      return res.status(400).json({ message: 'No such pending request' });

    ride.joinRequests = ride.joinRequests.filter(id => id.toString() !== requestId);

    if (decision === 'approved') {
      ride.approvedRiders.push(requestId);
    }

    await ride.save();

    return res.json({
      message: `Request ${decision}`,
      ride
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};





exports.getMyRides = async (req, res) => {
  try {
    const userId = req.user.id;

    const rides = await Ride.find({
      $or: [
        { driver: userId },
        { joinRequests: userId }
      ]
    })
      .sort({ departureTime: -1 })
      .populate('driver', 'name email')
      .populate('joinRequests', 'name email')
      .populate('approvedRiders', 'name email');

    const annotatedRides = rides.map((ride) => {
      const isDriver = ride.driver._id.toString() === userId;
      return {
        ...ride.toObject(),
        role: isDriver ? 'driver' : 'rider'
      };
    });

    res.json(annotatedRides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch rides' });
  }
};
