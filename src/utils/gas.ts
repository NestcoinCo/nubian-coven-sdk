import axios from "axios";

async function getGasPrice() {
    const response = await axios.get(`https://bscgas.info/gas?apikey=${process.env.BSCGAS_API_KEY}`);
    return response.data.fast.toString();
}

export default getGasPrice;