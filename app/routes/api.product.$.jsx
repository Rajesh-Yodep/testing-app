import {
    productCreateController,
    productUpdateController,
    productDeleteController,
    productAssignCollectionController,
    productRemoveCollectionController,
    productPublishController,
    productUnpublishController,
} from "../server/controllers/product.controller.server";
import { dispatchApiRequest } from "../server/utils/api-router.server";

const productHandlers = {
    "POST create": (request, admin) => productCreateController(request, admin),
    "PUT update": (request, admin) => productUpdateController(request, admin),
    "DELETE delete": (request, admin) => productDeleteController(request, admin),
    "POST assign-collection": (request, admin) => productAssignCollectionController(request, admin),
    "POST remove-collection": (request, admin) => productRemoveCollectionController(request, admin),
    "POST publish": (request, admin) => productPublishController(request, admin),
    "POST unpublish": (request, admin) => productUnpublishController(request, admin),
};

function logRequest(request) {
    console.log(`[API product] ${request.method} ${request.url}`);
}

export const loader = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], productHandlers);
};

export const action = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], productHandlers);
};
