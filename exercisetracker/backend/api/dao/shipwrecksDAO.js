
let shipwrecks

export default class ShipwrecksDAO {
  static async injectDB(conn) {
    if (shipwrecks) {
      return
    }
    try {
        shipwrecks = await conn.db(process.env.RESTREVIEWS_NS).collection("shipwrecks")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in shipwrecksDAO: ${e}`,
      )
    }
  }

  static async getShipwrecks({
    filters = null,
    page = 0,
    shipwrecksPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } }
      } else if ("cuisine" in filters) {
        query = { "cuisine": { $eq: filters["cuisine"] } }
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } }
      }
    }

    let cursor
    
    try {
      cursor = await shipwrecks
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { shipwrecksList: [], totalNumShipwrecks: 0 }
    }

    const displayCursor = cursor.limit(shipwrecksPerPage).skip(shipwrecksPerPage * page)

    try {
      const shipwrecksList = await displayCursor.toArray()
      const totalNumShipwrecks = await shipwrecks.countDocuments(query)

      return { shipwrecksList, totalNumShipwrecks }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { shipwrecksList: [], totalNumShipwrecks: 0 }
    }
  }
}