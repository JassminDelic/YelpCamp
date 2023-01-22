const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
	console.log("Database connected.");
}

main().catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: "63ca9925367bde6615a2eb93",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: "https://res.cloudinary.com/dzbisffvd/image/upload/v1674333264/YelpCamp/oxsfzqcmqau7031g9gk7.jpg",
					filename: "YelpCamp/oxsfzqcmqau7031g9gk7",
				},
				{
					url: "https://res.cloudinary.com/dzbisffvd/image/upload/v1674333277/YelpCamp/rkgvtyo8zkqi1nl0pmw8.jpg",
					filename: "YelpCamp/rkgvtyo8zkqi1nl0pmw8",
				},
			],
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum sed neque aspernatur, beatae aut ipsam repellendus quo possimus sequi magnam animi facere harum nisi. Unde similique voluptatem voluptas quibusdam saepe.",
			price,
			geometry: { type: "Point", coordinates: [-122.330062, 47.603832] },
		});
		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());
