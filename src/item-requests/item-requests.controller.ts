import { Controller } from '@nestjs/common';

@Controller()
export class ItemRequestsController {
  async getItemRequest() {
    // Include names of anything refered to by id
  }

  async getItemRequestPage() {
    // Include names of anything refered to by id
  }

  async createRequest() {
    // Only by Site managers
    // Send approval request to random lowest level staff
  }

  async editRequest() {
    // Only by Site managers
    // Can only be done if pending approval
  }

  async deleteRequest() {
    // Only by Site managers
    // Can only be done if pending approval
  }

  async approveRequest() {
    // Only by Procurement Staff or others
    // Can only be done if pending approval or partially approved
    // Can be approved or disapproved. If approval is finalized, send email to supplier.
  }

  async createDelivery() {
    // Only by Site managers
    // Can only be done if approved or partially delivered
  }

  async deleteDelivery() {
    // Only by Site managers
    // Can only be done if approved or partially delivered
  }

  async editDelivery() {
    // Only by Site managers
    // Can only be done if approved or partially delivered
  }

  async createInvoice() {
    // Only by Site managers
    // Can only be done if pending invoice
  }
}
