const fs = require('fs');
const http = require('https');

class LeBonCoin {      // LeBonCoin pour un fichier JSON
    get_list() {     
        return new Promise((resolve, reject) => {

            const options = {
                method: 'POST',
                hostname: 'leboncoin1.p.rapidapi.com',
                port: null,
                path: '/v2/leboncoin/search_api',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': 'fcc988283bmsh17e3dbff667ffc0p1719fcjsne20976da51e6',
                    'X-RapidAPI-Host': 'leboncoin1.p.rapidapi.com'
                }
            };

            const req = http.request(options, function (res) {
                const chunks = [];

                res.on('data', function (chunk) {
                    chunks.push(chunk);
                });

                res.on('end', function () {
                    const body = Buffer.concat(chunks);
                    const jsonData = JSON.parse(body.toString());
                    console.log('JSON data received');
                    console.log(jsonData);
                    console.log('Writing data to file');
                    fs.writeFile('connexion.json', JSON.stringify(jsonData), (err) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log('Data written to file');
                            resolve();
                        }
                    });
                });
            });

            req.write(JSON.stringify({
                filters: {
                    category: { id: '8' },
                    enums: { ad_type: ['offer'] },
                    keywords: {
                        text: 'appartement',
                        parrot_used: 4
                    },
                    location: {
                        locations: [
                            {
                                locationType: 'city',
                                label: 'Lille (toute la ville)',
                                city: 'Lille',
                                department_id: '59',
                                region_id: '17',
                                area: {
                                    lat: 50.6282,
                                    lng: 3.06881,
                                    default_radius: 5000,
                                    radius: 10000
                                }
                            }
                        ]
                    }
                },
                owner_type: 'all',
                limit: 10,
                limit_alu: 3,
                sort_by: 'relevance',
                sort_order: 'desc',
                offset: 0,
                extend: true,
                listing_source: 'direct-search'
            }));
            req.end();

        });
    }
}

module.exports = LeBonCoin;
