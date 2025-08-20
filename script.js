// Your code here.
// Get the container and items
const container = document.querySelector('.items');
const items = document.querySelectorAll('.item');

// Adjust container to grid layout for initial grid formation
container.style.display = 'grid';
container.style.gridTemplateColumns = 'repeat(5, 120px)';
container.style.gridTemplateRows = 'repeat(5, 120px)';
container.style.gap = '0';
container.style.overflow = 'hidden';
container.style.whiteSpace = 'normal';
container.style.alignContent = 'center';
container.style.justifyContent = 'center';

// Adjust item styles for square cubes and remove 3D transforms
items.forEach(item => {
  item.style.width = '120px';
  item.style.height = '120px';
  item.style.transform = 'none';
  item.style.fontSize = '40px'; // Adjusted for better fit in smaller size
});

// Calculate current positions after grid layout
let containerRect = container.getBoundingClientRect();
const positions = Array.from(items).map(item => {
  const rect = item.getBoundingClientRect();
  return {
    left: rect.left - containerRect.left,
    top: rect.top - containerRect.top
  };
});

// Set all items to absolute positioning to enable free dragging without reflow
items.forEach((item, index) => {
  item.style.position = 'absolute';
  item.style.left = `${positions[index].left}px`;
  item.style.top = `${positions[index].top}px`;
});

// Drag logic
let selectedItem = null;
let offsetX = 0;
let offsetY = 0;

// Add mousedown listener to each item
items.forEach(item => {
  item.addEventListener('mousedown', e => {
    selectedItem = item;
    containerRect = container.getBoundingClientRect(); // Refresh rect
    const itemRect = item.getBoundingClientRect();
    offsetX = e.clientX - itemRect.left;
    offsetY = e.clientY - itemRect.top;
    item.style.zIndex = '1000'; // Bring to front
    container.classList.add('active');
    e.preventDefault(); // Prevent text selection
  });
});

// Mousemove on document for dragging
document.addEventListener('mousemove', e => {
  if (!selectedItem) return;
  containerRect = container.getBoundingClientRect(); // Refresh in case of changes

  // Calculate new position
  let newLeft = e.clientX - containerRect.left - offsetX;
  let newTop = e.clientY - containerRect.top - offsetY;

  // Clamp to boundaries (prevents going outside during drag)
  const itemWidth = selectedItem.offsetWidth;
  const itemHeight = selectedItem.offsetHeight;
  newLeft = Math.max(0, Math.min(newLeft, container.clientWidth - itemWidth));
  newTop = Math.max(0, Math.min(newTop, container.clientHeight - itemHeight));

  // Update position
  selectedItem.style.left = `${newLeft}px`;
  selectedItem.style.top = `${newTop}px`;
});

// Mouseup on document to drop
document.addEventListener('mouseup', () => {
  if (selectedItem) {
    selectedItem.style.zIndex = ''; // Reset z-index
    container.classList.remove('active');
    selectedItem = null;
  }
});
