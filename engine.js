// engine.js

class OrderHeap {
    constructor(isMaxHeap = true) {
        // This is our storage 'pile' for orders
        this.heap = []; 
        
        // Buyers want the MAX price at the top. 
        // Sellers want the MIN price at the top.
        this.isMaxHeap = isMaxHeap; 
    }

    // This function lets us 'peek' at the person at the very top of the pyramid
    peek() {
        return this.heap[0] || null;
    }

    // This is the logic that adds a new order to the pile
    push(order) {
        this.heap.push(order); // Put them at the very bottom first
        this.bubbleUp();       // Then let them 'cut the line' if their price is better
    }

    bubbleUp() {
        let index = this.heap.length - 1; // Start at the bottom
        
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2); // Find the person 'above' them
            
            // If our price is better than the person above us, SWAP!
            if (this.shouldSwap(index, parentIndex)) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex; // Move up the pyramid and check again
            } else {
                break; // Our price isn't better, so stay put
            }
        }
    }

    // This pushes an order DOWN the pyramid until it finds its correct spot
    bubbleDown() {
        let index = 0; // Start at the very top of the pyramid
        const length = this.heap.length;

        while (true) {
            let leftChild = 2 * index + 1;  // The person on the left underneath them
            let rightChild = 2 * index + 2; // The person on the right underneath them
            let bestIndex = index;          // We assume the current spot is best for now

            // Is the left person's price better than the current person?
            if (leftChild < length && this.shouldSwap(leftChild, bestIndex)) {
                bestIndex = leftChild;
            }

            // Is the right person's price even better than that?
            if (rightChild < length && this.shouldSwap(rightChild, bestIndex)) {
                bestIndex = rightChild;
            }

            // If neither person below is better, the pyramid is perfect. Stop!
            if (bestIndex === index) break;

            // Otherwise, SWAP with the better person and keep moving down
            [this.heap[index], this.heap[bestIndex]] = [this.heap[bestIndex], this.heap[index]];
            index = bestIndex;
        }
    }

    // Helper function to decide if one price is 'better' than another
    shouldSwap(index, parentIndex) {
        const myPrice = this.heap[index].price;
        const parentPrice = this.heap[parentIndex].price;

        if (this.isMaxHeap) {
            return myPrice > parentPrice; // For buyers: Higher is better
        } else {
            return myPrice < parentPrice; // For sellers: Lower is better
        }
    }
}

// Export this so we can use it in our server later
module.exports = OrderHeap;