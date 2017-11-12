const json = [
{"CityId": "SOFI", "Name": "Sofia", "CountryId": "BG", "Location": "23.4, 42.7", "Id": "SOF"},
{"CityId": "GENE", "Name": "Geneva", "CountryId": "CH", "Location": "6.110278, 46.239444", "Id": "GVA"},
{"CityId": "KUUS", "Name": "Kuusamo", "CountryId": "FI", "Location": "29.233889, 65.990278", "Id": "KAO"},
{"CountryId": "FR", "Name": "Toulouse", "RegionId": "MIDI_", "CityId": "TOUS", "Location": "1.365, 43.630278", "Id": "TLS"},
{"CityId": "BUCH", "Name": "Bucharest Otopeni", "CountryId": "RO", "Location": "26.1, 44.566667", "Id": "OTP"},
{"CityId": "STOC", "Name": "Stockholm Arlanda", "CountryId": "SE", "Location": "17.933889, 59.661944", "Id": "ARN"},
{"CityId": "KOSI", "Name": "Kosice", "CountryId": "SK", "Location": "21.25, 48.666667", "Id": "KSC"},
{"CountryId": "UK", "Name": "Edinburgh", "RegionId": "SCOTL", "CityId": "EDIN", "Location": "-3.3635, 55.9497", "Id": "EDI"}
]
module.exports = json.map(({ Location, Id }) => ({
  lat: parseFloat(Location.slice(0, Location.indexOf(','))),
  lng: parseFloat(Location.slice(Location.indexOf(', ') + 2)),
  Id
}))

console.log(module.exports)
