const axios = require('axios')
const language = require('@google-cloud/language');

class TextAnalyzer {
    static async analyze(req, res) {
        // Imports the Google Cloud client library
        // Creates a client
        const client = new language.LanguageServiceClient();

        // Prepares a document, representing the provided text
        const document = {
            content: req.body.text,
            type: 'PLAIN_TEXT',
        };

        // Detects entities in the document
        const [result] = await client.analyzeEntities({document});
        const entities = result.entities;

        if(entities) {
            res.status(200).json(entities)
        }
        else {
            res.status(500).json('Error during text analysis')
        }

    }
}

module.exports = TextAnalyzer