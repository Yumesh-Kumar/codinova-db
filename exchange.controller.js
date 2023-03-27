const Exchange = require("./exchange.schema");
const axios = require("axios");

async function getExchangeList(req, res) {
  try {
    const { name, pageNumber, limit } = req.query;

    const start = (pageNumber - 1) * limit;

    const filter = { name: new RegExp(name, "i") };
    const end = Number(start) + Number(limit);
    const exchanges = await Exchange.find().where(filter).skip(start).limit(limit).exec();
    const totalData = await Exchange.countDocuments();

    res.status(200).send({
      message: "Data get successfully",
      data: exchanges,
      totalData,
      currentPage: Number(pageNumber),
      next: Number(pageNumber) + 1,
      prev: Number(pageNumber) - 1 ?? Number(pageNumber) > 0,
      start,
      end,
      limit: Number(limit),
      totalPages: Math.ceil(totalData / limit),
    });
  } catch (error) {
    console.log("error", error);
    res.status(202).send({ message: "Something went wrong" });
  }
}

async function syncExchangeListToDB(req, res) {
  try {
    const exchangeData = await axios.get(
      `https://rest.coinapi.io/v1/exchanges?apikey=FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9`
    );
    const exchangeIconData = await axios.get(
      `https://rest.coinapi.io/v1/exchanges/icons/32?apikey=FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9`
    );
    const exchanges = exchangeData.data;
    const exchangeIcon = exchangeIconData.data;
    const operations = exchanges.map((exchange) => {
      let filtered = exchangeIcon.filter((item) => item.exchange_id === exchange.exchange_id);
      return {
        updateOne: {
          filter: { exchange_id: exchange.exchange_id },
          update: {
            ...exchange,
            iconUrl: filtered.length ? filtered[0].url : "",
          },
          upsert: true,
        },
      };
    });

    await Exchange.bulkWrite(operations);
    res.status(200).send({ message: "Exchanges synced successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(202).send({ message: "Something went wrong" });
  }
}

module.exports = { getExchangeList, syncExchangeListToDB };
