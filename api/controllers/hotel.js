import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body)
        try{
            const savedHotel = await newHotel.save();
            res.status(200).json(savedHotel)
        }catch(err){
            next(err);
        }

}

export const updateHotel = async (req, res, next) => {
     try{
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, 
                {$set: req.body}, 
                {new: true});
        res.status(200).json(updatedHotel)
    }catch(err){
            next(err);
        }
}

export const deleteHotel = async (req, res, next) => {
    try{
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel has been deleted")

    }catch(err){
        next(err);
    }

}

export const getHotel = async (req, res, next) => {
    console.log("Fetching hotel with ID:", req.params.id);

    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            console.log("Hotel not found");
            return res.status(404).json({ message: "Hotel not found" });
        }

        console.log("Hotel found:", hotel);
        res.status(200).json(hotel);
    } catch (err) {
        console.error("Error fetching hotel:", err);
        next(err);
    }
};


// export const getHotels = async (req, res, next) => {
//     try {
//         // Properly handle the 'featured' query param
//         let query = {};
//         if (req.query.featured) {
//             query.featured = req.query.featured === "true"; // Convert to boolean
//         }

//         let limit = parseInt(req.query.limit, 10);
//         if (isNaN(limit)) {
//             limit = 0; // No limit if it's NaN
//         }

//         const hotels = await Hotel.find(query).limit(limit);
        
//         res.status(200).json(hotels);
//     } catch (err) {
//         next(err);
//     }
// };

export const getHotels = async (req, res, next) => {
    try {
        const { min, max, featured, limit, ...others } = req.query; // Extract separately

        // Convert min and max to numbers with default values
        const minPrice = parseInt(min, 10) || 1;
        const maxPrice = parseInt(max, 10) || 999;
        const limitNum = parseInt(limit, 10) || 0;

        let query = { ...others, cheapestPrice: { $gt: minPrice, $lt: maxPrice } };

        // Convert 'featured' to boolean only if it exists
        if (featured !== undefined) {
            query.featured = featured === "true"; // ✅ Correct conversion
        }

    

        // Query the database
        const hotels = await Hotel.find(query).limit(limitNum);
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};





export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",")
    try{
    const list = await Promise.all(cities.map(city => {
        return Hotel.countDocuments({city: city})
    }))
        res.status(200).json(list)
    }catch(err){
        next(err)
    }

}

export const countByType = async (req, res, next) => {
    try {
      const hotelCount = await Hotel.countDocuments({ type: "hotel" });
      const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
      const resortCount = await Hotel.countDocuments({ type: "resort" });
      const villaCount = await Hotel.countDocuments({ type: "villa" });
      const cabinCount = await Hotel.countDocuments({ type: "cabin" });
  
      res.status(200).json([
        { type: "hotel", count: hotelCount },
        { type: "apartments", count: apartmentCount },
        { type: "resorts", count: resortCount },
        { type: "villas", count: villaCount },
        { type: "cabins", count: cabinCount },
      ]);
    } catch (err) {
      next(err);
    }
  };

export const getHotelRooms = async (req, res, next) => {
    try{
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        const list = await Promise.all(
            hotel.rooms.map((room) => {
                return Room.findById(room);
            })
        );
        res.status(200).json(list)
    }catch(err){
        next(err);

    }
}