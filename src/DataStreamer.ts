export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | unidentified,
}
/**
 * The datafeed server returns an array of ServerRespond with 2 stocks.
 * We do not have to manipulate the ServerRespond for the purpose of this task.
 */

 export class DataStreamer {
    static generateRow(serverRespond: ServerRespond[]): Row {
        const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
        const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
        const ratio = priceABC / priceDEF;
        const upperbound = 1 + 0.05;
        const lowerbound = 1 - 0.05;
        return{
            price_abc: priceABC,
            price_def: priceDEF,
            ratio,
            timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
                serverRespond[0].timestamp : serverRespond[1].timestamp,
            upper_bound: upper_bound,
            lower_bound: lowerbound,
            trigger_alert: (ratio > upper_bound || ratio < lowerbound) ? ratio : unidentified,
        };
    }
 }




export interface ServerRespond {
  stock: string,
  top_bid: Order,
  top_ask: Order,
  timestamp: Date,
}

class DataStreamer {
  // The url where datafeed server is listening
  static API_URL: string = 'http://localhost:8080/query?id=1';

  /**
   * Send request to the datafeed server and executes callback function on success
   * @param callback callback function that takes JSON object as its argument
   */
  static getData(callback: (data: ServerRespond[]) => void): void {
    const request = new XMLHttpRequest();
    request.open('GET', DataStreamer.API_URL, false);

    request.onload = () => {
      if (request.status === 200) {
        callback(JSON.parse(request.responseText));
      } else {
        alert ('Request failed');
      }
    }

    request.send();
  }
}

export default DataStreamer;