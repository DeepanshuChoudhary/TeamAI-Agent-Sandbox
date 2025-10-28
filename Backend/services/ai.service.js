import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_KEY
});

export const generateResult = async (prompt) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.7,
            responseMimeType: "application/json",
            // responseSchema: {
            //     type:"object",
            //     properties: {
            //         text: {
            //             type: 'string'
            //         },
            //         code: {
            //             type: 'object'
            //         }
            //     }
            // },
            systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development. You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
            
            Examples: 

            <exmaple>

                
                user: Create an express application
                response: {
                    "text":"This is your fileTree structure of the express server".
                    "fileTree":" {
                        "app.js": {
                            content: "
                                const express = require('express');

                                const app = express();

                                app.get('/', (req,res) => {
                                    res.send('hello world!');
                                })

                                app.listen(3000, () => {
                                    console.log('Server is running on port 3000')
                                })
                            "
                        },
                        "package.json": {

                            content : "{
                                {
                                    "name": "temp-server",
                                    "version": "1.0.0",
                                    "main": "server.js",
                                    "type": "module",
                                    "scripts": {
                                        "test": "echo \"Error: no test specified\" && exit 1"
                                    },
                                    "keywords": [],
                                    "author": "",
                                    "license": "ISC",
                                    "description": "",
                                    "dependencies": {
                                        "@google/genai": "^1.27.0",
                                        "bcrypt": "^6.0.0",
                                        "bcryptjs": "^3.0.2",
                                        "cookie-parser": "^1.4.7",
                                        "cors": "^2.8.5",
                                        "dotenv": "^17.2.3",
                                        "express": "^5.1.0",
                                        "express-validator": "^7.2.1",
                                        "ioredis": "^5.8.1",
                                        "jsonwebtoken": "^9.0.2",
                                        "mongoose": "^8.19.0",
                                        "morgan": "^1.10.1",
                                        "router": "^2.2.0",
                                        "routes": "^2.1.0",
                                        "socket.io": "^4.8.1"
                                    }
                                }
                                    ",
                                
                                "buildCommand": {
                                    mainItem: "npm",
                                    commands: ["install"]
                                },

                                "startCommand": {
                                    mainItem:"node",
                                    commands:["app.js"]
                                }

                            }

                        }
                    }
                }

            </exmaple>

            <exmaple>
                user: Hello
                response: {
                    "text": "Hello, How can i help you today deepengineeryt@gmail.com"
                }
            </exmaple>

            `
        }
    });
    // console.log(response.text);
    return response.text;
}