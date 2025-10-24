import * as ai from '../services/ai.service.js';

export const getResult = async (req, res) => {
    try {
        const { prompt } = req.query;
        const result = await ai.generateResult(prompt);
        res.send(result);
    }
    catch (err) {
        console.log('ERROR :- ', err.message)
        res.status(500).send({ message: err.message });
    }
}