import { Hono } from "hono";
import { getTokenFromRequest, verifyJwt } from "../middlewares/auth";
import { getD1 } from "../utils/database";
import { CRequest, getRequestById, sendRequest } from "../database";

const req = new Hono();

// get all requests only for admin
req.get("/", async(c)=>{
    try {
        const token = await getTokenFromRequest(c);
        if (!token) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        const user = await verifyJwt(token, c);
        if (!user || user.role !== 'ADMIN') {
            return c.json({ error: 'Forbidden' }, 403);
        }
        const db = getD1(c);
        const requests = await db.prepare('SELECT * FROM requests').all();
        return c.json({ requests: requests.results || [] });
    }
    catch (error) {
        console.error('Error in /auth/signup:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
})
// POST /request/add
req.post("/add", async(c)=>{
    try {
        const token = await getTokenFromRequest(c);
        if (!token) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        const user = await verifyJwt(token, c);
        if (!user) {
            return c.json({ error: 'Invalid token' }, 401);
        }
        
        const data = await c.req.json();
        const db = getD1(c);
        data.user_id = user.id
        data.status = "PENDING"
        // Validate request data
        if (!data.request_type || !data.additional_info) {
            return c.json({ error: 'Missing required fields' }, 400);
        }
        switch (data.request_type) {
            case 'Buy Stock':
                //check if all required fields are present in additional_info json
                if (!data.additional_info || !data.additional_info.stock_symbol || !data.additional_info.quantity) {
                    return c.json({ error: 'Missing required fields in additional_info' }, 400);
                } else {
                    data.additional_info = JSON.stringify(data.additional_info);
                }
                break;
            case 'Sell Stock':
                if (!data.additional_info || !data.additional_info.stock_symbol || !data.additional_info.quantity) {
                    return c.json({ error: 'Missing required fields in additional_info' }, 400);
                } else {
                    data.additional_info = JSON.stringify(data.additional_info);
                }
                break;
            case 'Withdraw Funds':
                if (!data.additional_info || !data.additional_info.amount) {
                    return c.json({ error: 'Missing required fields in additional_info' }, 400);
                } else {
                    data.additional_info = JSON.stringify(data.additional_info);
                }
                break;
            case 'Add Funds':
                if (!data.additional_info || !data.additional_info.amount) {
                    return c.json({ error: 'Missing required fields in additional_info' }, 400);
                } else {
                    data.additional_info = JSON.stringify(data.additional_info);
                }
                break;
            case 'Password Reset':
                if (!data.additional_info || !data.additional_info.email || !data.additional_info.new_password) {
                    return c.json({ error: 'Missing required fields in additional_info' }, 400);
                } else {
                    data.additional_info = JSON.stringify(data.additional_info);
                }
                break;
            default:
                return c.json({ error: 'Invalid request type' }, 400);
        }
        const request = await sendRequest(db, data);
        return c.json({ success: true, request });
    } catch (error) {
        console.error('Error in /request/add:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});
// POST /accept/request/:id
req.post("/accept/:id", async(c)=>{
    try {
        const token = await getTokenFromRequest(c);
        if (!token) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        const user = await verifyJwt(token, c);
        if (!user || user.role !== 'ADMIN') {
            return c.json({ error: 'Forbidden' }, 403);
        }
        
        const requestId = c.req.param('id');
        const db = getD1(c);
        const request:CRequest|null = await getRequestById(db, parseInt(requestId));
        if (!request) {
            return c.json({ error: 'Request not found' }, 404);
        }
        switch (request.request_type) {
            case 'Buy Stock':
                // Logic to handle Buy Stock request
                break;
            case 'Sell Stock':
                // Logic to handle Sell Stock request
                break;
            case 'Withdraw Funds':
                // Logic to handle Withdraw Funds request
                break;
            case 'Add Funds':
                // Logic to handle Add Funds request
                break;
            case 'Password Reset':
                // Logic to handle Password Reset request
                break;
            default:
                return c.json({ error: 'Invalid request type' }, 400);
        }
        
        return c.json({ success: true });
    } catch (error) {
        console.error('Error in /accept/request:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default req;