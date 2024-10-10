import { match } from 'path-to-regexp';
import { processorRegistry } from './processorRegistry';
import { requestQueue } from '../config/requestQueue';
import { NextFunction, Request, Response } from 'express';
import { log } from 'console';
import { Types } from 'mongoose';

requestQueue.process(10, async (queueItem, done) => {
  const { id, req: reqData }: { id: Types.ObjectId; req: Request } = queueItem.data;

  // Tạo một đối tượng req-like từ dữ liệu đã lưu trong hàng đợi
  const reqDetail = {
    method: reqData.method,
    url: reqData.url,
    body: reqData.body,
    query: reqData.query,
    params: reqData.params,
    headers: reqData.headers,
  };

  // Create mock response object (if needed)
  const resDetail = {
    status: (code: number) => {
      return resDetail;
    },
    json: () => {
      console.log(`Running...`);
    },
  };

  try {
    const urlWithoutQuery = reqDetail.url.split('?')[0]; // Tách phần query string ra khỏi URL
    console.log('URL without query:', urlWithoutQuery);

    // Tìm key khớp với URL từ processorRegistry
    const matchedProcessorKey = Object.keys(processorRegistry).find((pattern) => {
      const matcher = match(pattern, { decode: decodeURIComponent });
      return matcher(urlWithoutQuery); // Kiểm tra xem URL có khớp không
    }) as keyof typeof processorRegistry;

    console.log('Matched Processor Key:', matchedProcessorKey);

    if (matchedProcessorKey) {
      const processor = processorRegistry[matchedProcessorKey];

      // Trích xuất params từ URL nếu có
      const matcher = match(matchedProcessorKey, { decode: decodeURIComponent });
      const matchResult = matcher(urlWithoutQuery);
      // log("MATCHINGGGGGGGGGGGG: ", matchResult);
      if (matchResult) {
        reqDetail.params = Object.fromEntries(
          Object.entries(matchResult.params).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value || ''])
        ) as Record<string, string>;
        console.log('Extracted params:', reqDetail.params);

        // Gọi processor tương ứng để xử lý yêu cầu
        await processor(reqDetail as Request, resDetail as Response, () => {});
        console.log('Finished processing request:', reqDetail.url);
      } else {
        throw new Error(`No matching processor found for URL: ${urlWithoutQuery}`);
      }
    } else {
      console.log('No matched processor found for URL:', urlWithoutQuery);
    }

    done(); // Đánh dấu task hoàn thành
  } catch (error) {
    console.error('Error processing task:', error);
    done(new Error('Failed to process task'));
  }
});
