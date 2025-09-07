import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

// 注意：后端存在两个前缀：读取走 /chatrooms，管理走 /chat-rooms
const BASE_ROOMS = '/chatrooms'
const BASE_MGMT = '/chat-rooms'

export const chatRoomsAdapter = {
  async getAllChatRooms(roomType = null) {
    const query = roomType ? { room_type: roomType } : undefined
    return __request(OpenAPI, { method: 'GET', url: `${BASE_ROOMS}/`, query })
  },
  async getChatRoomById(roomId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE_ROOMS}/${roomId}` })
  },
  async updateChatRoom(roomId, roomData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE_ROOMS}/${roomId}/`, body: roomData })
  },
  async deleteChatRoom(roomId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE_ROOMS}/${roomId}` })
  },
  async getMessages(roomId, limit = 50, offset = 0) {
    const query = { limit, offset }
    return __request(OpenAPI, { method: 'GET', url: `${BASE_ROOMS}/${roomId}/messages/`, query })
  },
  async sendMessage(roomId, messageData) {
    const formData = {}
    if (messageData?.file instanceof Blob) formData['file'] = messageData.file
    if (messageData?.content_text) formData['content_text'] = String(messageData.content_text)
    if (messageData?.media_url) formData['media_url'] = String(messageData.media_url)
    if (messageData?.message_type) formData['message_type'] = String(messageData.message_type)
    if (Object.keys(formData).length === 0) formData['noop'] = '1'
    return __request(OpenAPI, { method: 'POST', url: `${BASE_ROOMS}/${roomId}/messages/`, formData })
  },
  async getMembers(roomId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE_ROOMS}/${roomId}/members` })
  },
  async createChatRoom(roomData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE_MGMT}/`, body: roomData })
  },
  async setMemberRole(roomId, memberId, role) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE_MGMT}/${roomId}/members/${memberId}/set-role`, body: { role } })
  },
  async removeMember(roomId, memberId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE_MGMT}/${roomId}/members/${memberId}` })
  },
  async createJoinRequest(roomId, requestData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE_MGMT}/${roomId}/join-request`, body: requestData })
  },
  async getJoinRequests(roomId, statusFilter = null) {
    const query = statusFilter ? { status_filter: statusFilter } : undefined
    return __request(OpenAPI, { method: 'GET', url: `${BASE_MGMT}/${roomId}/join-requests`, query })
  },
  async processJoinRequest(joinRequestId, status) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE_MGMT}/join-requests/${joinRequestId}/process`, body: { status } })
  },
}

export default chatRoomsAdapter
