const path = require('path');

// Use the existing dishes data
const dishes = require(path.resolve('src/data/dishes-data'));

// Use this function to assign ID's when necessary
const nextId = require('../utils/nextId');

// TODO: Implement the /dishes handlers needed to make the tests pass
const requiredFields = ['name', 'description', 'price', 'image_url'];

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}`,
  });
}

function hasName(req, res, next) {
  const { name } = req.body.data;

  if (!name || name === '') {
    next({
      status: 400,
      message: `Dish must include a name`,
    });
  }
  next();
}

function hasDescription(req, res, next) {
  const { description } = req.body.data;
  if (!description || description === '') {
    next({
      status: 400,
      message: `Dish must include a description`,
    });
  }
  next();
}

function hasPrice(req, res, next) {
  const { price } = req.body.data;
  if (!price) {
    next({
      status: 400,
      message: `Dish must include a price`,
    });
  }
  if (typeof price !== 'number' || price <= 0) {
    next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
  next();
}
function hasImageUrl(req, res, next) {
  const { image_url } = req.body.data;
  if (!image_url || image_url === '') {
    next({
      status: 400,
      message: `Dish must include an image_url`,
    });
  }
  next();
}

function idsMatch(req, res, next) {
  const originalId = req.params.dishId;
  const { id } = req.body.data;
  if (id && id !== originalId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${req.params.dishId}`,
    });
  }
  next();
}

function create(req, res, next) {
  const {
    data: { name, description, price, image_url },
  } = req.body;

  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

function update(req, res, next) {
  const originalId = req.params.dishId;
  const {
    data: { id, name, description, price, image_url },
  } = req.body;
  const updatedDish = {
    id: originalId,
    name,
    description,
    price,
    image_url,
  };
  res.json({ data: updatedDish });
}

function list(req, res, next) {
  res.json({ data: dishes });
}

module.exports = {
  create: [hasName, hasDescription, hasPrice, hasImageUrl, create],
  read: [dishExists, read],
  update: [
    dishExists,
    hasName,
    hasDescription,
    hasPrice,
    hasImageUrl,
    idsMatch,
    update,
  ],
  list,
};