import { API, adminEndpoints } from "../api";
import { Country } from "../models/countryModel";

class TcCountry {
  static IMPORT_COUNTRY(formData: FormData) {
    throw new Error("Method not implemented.");
  }
  static createCountry(country: Country) {
    return API.post(adminEndpoints.api.country.saveCountry, country);
  }
  static updateCountry(country: Country) {
    return API.put(adminEndpoints.api.country.updateCountry, country);
  }
  static deleteCountry(id: number) {
    return API.delete(adminEndpoints.api.country.deleteCountry(id));
  }
  static findAllCountres() {
    return API.get(adminEndpoints.api.country.findAllCountries);
  }
  static searchCountries(searchFields: Country) {
    return API.post(adminEndpoints.api.country.searchCountry, searchFields);
  }

  static importCountry(formData: FormData) {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return API.post(
      adminEndpoints.api.country.IMPORT_COUNTRY,
      formData,
      config,
    );
  }
}

export default TcCountry;
