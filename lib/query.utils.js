/**
 * Appends WHERE conditions to query builder based on given date parameters
 * @param {Object} queryBuilder - knex querybuilder instance. Mutated during this operation
 * @param {string} column
 * @param {Date} from
 * @param {Date} to
 */
function addAndWhereDate(queryBuilder, column, from, to) {
  if (from && to) {
    queryBuilder.whereBetween(column, [from, to]);
  } else if (from) {
    queryBuilder.andWhere(column, '>=', from);
  } else if (to) {
    queryBuilder.andWhere(column, '<=', to);
  }
}

function addAndWhereGte(knexBuilder, attrName, field) {
  if (field) {
    knexBuilder = knexBuilder.andWhere(() => {
      this.where(attrName, '>', field).orWhere(attrName, field);
    });
  }

  return knexBuilder;
}

function addAndWhereLte(knexBuilder, attrName, field) {
  if (field) {
    knexBuilder = knexBuilder.andWhere(() => {
      this.where(attrName, '<', field).orWhere(attrName, field);
    });
  }

  return knexBuilder;
}

function addAndWhere(knexBuilder, attrName, field) {
  if (field) {
    knexBuilder = _handleMultiValuedParameters(knexBuilder, attrName, field);
  }

  return knexBuilder;
}

function setRange(knexBuilder, rangeStart, rangeEnd) {
  if (rangeStart || rangeStart === 0) {
    knexBuilder = knexBuilder.offset(rangeStart).offset(rangeStart);

    if (rangeEnd || rangeEnd === 0) {
      // rangeStart and rangeEnd are inclusive, add 1
      knexBuilder = knexBuilder.limit(rangeEnd - rangeStart + 1);
    }
  }

  return knexBuilder;
}

/**
 * Use this to add an equation clause for the value which is either an object or an array
 * @param {Object} knexBuilder
 * @param {Object} attrName
 * @param {Object} parameter
 * @returns {Object} knexBuilder with added parameter
 */
function _handleMultiValuedParameters(knexBuilder, attrName, parameter) {
  if (parameter instanceof Set) {
    knexBuilder = knexBuilder.whereIn(attrName, Array.from(parameter));
  } else if (Array.isArray(parameter)) {
    knexBuilder = knexBuilder.whereIn(attrName, parameter);
  } else {
    knexBuilder = knexBuilder.where(attrName, parameter);
  }

  return knexBuilder;
}

module.exports = {
  addAndWhereDate,
  addAndWhere,
  addAndWhereGte,
  addAndWhereLte,
  setRange
};
