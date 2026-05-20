# JobPulse India - API Documentation

## Base URL

```
http://localhost:3000/api
https://your-deployment.vercel.app/api (production)
```

## Authentication

Most endpoints require authentication. Include the authorization token in the header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Get your access token by logging in with `/api/auth/login`.

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to confirm.",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Missing required fields, invalid email, weak password
- `500`: Server error

---

### Login User

**POST** `/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "state": "Karnataka",
    "employment_status": "Employed"
  },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ..."
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `404`: User not found
- `500`: Server error

---

## 👤 User Endpoints

### Get User Profile

**GET** `/user/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "state": "Karnataka",
  "city": "Bangalore",
  "degree": "B.Tech",
  "branch": "Computer Science",
  "college": "NIT Bangalore",
  "passout_year": 2024,
  "percentage": 8.5,
  "skills": ["JavaScript", "React", "Node.js"],
  "employment_status": "Employed",
  "company_name": "Tech Corp",
  "job_role": "Software Engineer",
  "salary_range": "10-15 LPA",
  "created_at": "2026-05-19T10:00:00Z",
  "updated_at": "2026-05-19T10:00:00Z"
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Profile not found
- `500`: Server error

---

### Update User Profile

**PUT** `/user/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "full_name": "John Doe",
  "phone": "9876543210",
  "state": "Karnataka",
  "city": "Bangalore",
  "degree": "B.Tech",
  "branch": "Computer Science",
  "college": "NIT Bangalore",
  "skills": ["JavaScript", "React", "Node.js", "Python"]
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    ...
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `400`: Invalid update data
- `500`: Server error

---

### Update Employment Status

**POST** `/user/employment`

Update user's employment status and job details.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "employment_status": "Employed",
  "company_name": "Tech Corp",
  "job_role": "Senior Engineer",
  "salary_range": "15-20 LPA",
  "joined_date": "2026-05-01"
}
```

**Valid Employment Statuses:**
- `Unemployed`
- `Internship`
- `Freelancing`
- `Part-time`
- `Employed`

**Response (200):**
```json
{
  "success": true,
  "message": "Employment status updated successfully"
}
```

**Error Responses:**
- `401`: Unauthorized
- `400`: Invalid employment status
- `500`: Server error

---

## 📊 Analytics Endpoints

### Get Global Analytics

**GET** `/analytics/global`

Get overall platform statistics.

**Response (200):**
```json
{
  "total_users": 10234,
  "total_employed": 5713,
  "total_unemployed": 4521,
  "total_internship": 234,
  "total_freelancing": 45,
  "total_part_time": 123,
  "employment_rate": 55.8,
  "unemployment_rate": 44.2,
  "top_states": [
    { "state": "Karnataka", "count": 1234 },
    { "state": "Tamil Nadu", "count": 1123 },
    { "state": "Maharashtra", "count": 987 }
  ]
}
```

---

### Get State Analytics

**GET** `/analytics/state?state=Karnataka`

Get employment statistics for a specific state or all states.

**Query Parameters:**
- `state` (optional): Filter by state name

**Response (200):**
```json
{
  "state_data": [
    {
      "state": "Karnataka",
      "total": 1234,
      "employed": 856,
      "unemployed": 378,
      "internship": 12,
      "freelancing": 5,
      "part_time": 8,
      "employment_rate": 69.4,
      "unemployment_rate": 30.6
    }
  ]
}
```

---

### Get Skills Analytics

**GET** `/analytics/skills`

Get most in-demand skills across the platform.

**Response (200):**
```json
{
  "total_skills": 156,
  "top_skills": [
    { "skill": "JavaScript", "count": 3421 },
    { "skill": "Python", "count": 2890 },
    { "skill": "React", "count": 2456 },
    { "skill": "SQL", "count": 2134 },
    { "skill": "Cloud/AWS", "count": 1876 }
  ]
}
```

---

## 🔍 Search Endpoints

### Search Users

**GET** `/search/users?q=john&state=Karnataka&degree=B.Tech&status=Employed`

Search for users based on filters.

**Query Parameters:**
- `q` (optional): Search by name or skills
- `state` (optional): Filter by state
- `degree` (optional): Filter by degree
- `status` (optional): Filter by employment status

**Response (200):**
```json
{
  "total": 5,
  "users": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "state": "Karnataka",
      "degree": "B.Tech",
      "employment_status": "Employed",
      "college": "NIT Bangalore",
      "skills": ["JavaScript", "React"]
    }
  ]
}
```

**Error Responses:**
- `400`: Invalid query parameters
- `500`: Server error

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting

Rate limits (implemented in Phase 2):
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John","email":"john@example.com","phone":"9876543210","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer TOKEN"

# Global Analytics
curl http://localhost:3000/api/analytics/global

# Search Users
curl "http://localhost:3000/api/search/users?q=john&state=Karnataka"
```

### Using Postman

1. Import the API endpoints
2. Set `{{base_url}}` to `http://localhost:3000/api`
3. After login, use the returned `access_token` in Authorization header

---

## Best Practices

1. **Always validate input**: Check email, phone, and password before sending
2. **Handle errors gracefully**: Show user-friendly error messages
3. **Store tokens securely**: Use localStorage for web, secure storage for mobile
4. **Never expose secrets**: Keep API keys and tokens private
5. **Use HTTPS in production**: Ensure secure communication
6. **Implement retries**: Network requests can fail, implement retry logic

---

## Webhooks (Coming Soon)

- User registration
- Employment status change
- Profile updates
- Milestone achievements

---

## Change Log

**v1.0.0** (May 2026)
- Initial API release
- Auth, User, Analytics, Search endpoints
- Supabase integration

---

## Support

For API issues or questions:
- Check the error message returned
- Review this documentation
- Check Supabase logs: https://app.supabase.com
- Create an issue on GitHub

---

**Last Updated:** May 19, 2026  
**API Version:** 1.0.0
