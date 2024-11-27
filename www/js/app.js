document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  var jsonrpc = $.extend( true, {}, jsonrpc_client );

  jsonrpc.server = jsonrpc_config.url;

  var login_method = $.extend( true, {}, jsonrpc_method );

  login_method.method_set( 'user.login' );

  login_method.param_set( 'api_token', jsonrpc_config.api_token );
  login_method.param_set( 'email',     email );
  login_method.param_set( 'password',  password );

  login_method.id_set( jsonrpc.generate_unique_id() );

  jsonrpc.method( login_method );

  jsonrpc.send( {
    success : function() {
      var result = jsonrpc.parse_json_response( jsonrpc.response );
      // console.log(result[ login_method.id ]);
      // console.log(result[ login_method.id ].message);
      // console.log(result[ login_method.id ].data.user);
      if ( result[ login_method.id ].message == 'login_successful' ) {
        localStorage.setItem('login', 'true');

        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('categoryPage').classList.remove('hidden');

        const userData = result[ login_method.id ].data.user;
        localStorage.setItem('user', JSON.stringify(userData));

        document.getElementById('userName').textContent = `Welcome, ${userData.first_name}`;
      } else {
        alert( 'Invalid credentials.' );
      }
    }
  } );
});

// console.log(localStorage.getItem('user'));
function logout() {
  localStorage.removeItem('login');  // Clear login status
  localStorage.removeItem('user');   // Clear user data if stored
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('categoryPage').classList.add('hidden');
}

document.getElementById('logoutButton').addEventListener('click', function() {
  logout();
});

if ( localStorage.getItem('login') === 'true' ) {
  user_data = localStorage.getItem('user');
  const userObject = JSON.parse(user_data);
  // const hash = userObject.hash;
  // Skip the login page if the user is already logged in
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('categoryPage').classList.remove('hidden');

  var jsonrpc = $.extend( true, {}, jsonrpc_client );

  jsonrpc.server = jsonrpc_config.url;

  var category_method = $.extend( true, {}, jsonrpc_method );

  category_method.method_set( 'category.get' );

  category_method.param_set( 'api_token', jsonrpc_config.api_token );
  // category_method.param_set( 'hash', hash );

  category_method.id_set( jsonrpc.generate_unique_id() );

  jsonrpc.method( category_method );

  jsonrpc.send({
    success: function() {
      var result = jsonrpc.parse_json_response(jsonrpc.response);
      // Assuming `data` is your categories array
      const data = result[category_method.id].data.categories;
      console.log(data);

      // Create a map for all categories by folder_id
      const categoryMap = {};
      const categories = [];

      // Create the basic structure of each category
      data.forEach(category => {
        var file_method = $.extend(true, {}, jsonrpc_method);

        file_method.method_set('file.get_file');
        file_method.param_set('file_id', category.file_id);
        file_method.param_set('file_path', true);
        file_method.param_set('no_data', true);
        file_method.param_set('api_token', jsonrpc_config.api_token);

        file_method.id_set(jsonrpc.generate_unique_id());

        jsonrpc.method(file_method);

        // Set up the category map without the image yet
        categoryMap[category.category_id] = {
          name: category.category_name,
          image: '',  // We will update this once we get the correct file path
          subcategories: []
        };

        jsonrpc.send({
          success: function() {
            var result = jsonrpc.parse_json_response(jsonrpc.response);
            var file = result[file_method.id].data;
            // console.log(file);
            // console.log(category.file_id);

            var localFilePath = file.file_path;
            console.log("Local file path: ", localFilePath);

            // Dynamically find and replace the part before '/files/'
            var category_image = localFilePath.replace(/.*\/files\//, jsonrpc_config.appback_files);

            // Now update the image field inside the categoryMap for the respective category
            categoryMap[category.category_id].image = category_image;
            console.log("Updated category image for ID " + category.category_id + ": ", category_image);
          }
        });
      });

      // Function to recursively build the hierarchy
      function buildHierarchy() {
        data.forEach(category => {
          if (category.parent_id === null) {
            // Top level categories (with no parent)
            categories.push(categoryMap[category.category_id]);
          } else {
            // Add category to its parent
            const parentCategory = categoryMap[category.parent_id];
            if (parentCategory) {
              parentCategory.subcategories.push(categoryMap[category.category_id]);
            }
          }
        });
      }

      // Build the hierarchical structure
      buildHierarchy();

      // To verify the structure
      // console.log(JSON.stringify(categories, null, 2));

      // Now that `categories` is populated, initialize the swipe functionality
      let currentCategoryIndex = 0;
      let currentCardElement = null;
      let currentLevel = categories;  // This keeps track of where we are (main categories, subcategories, etc.)
      let parentStack = [];  // Stack to keep track of parent categories when drilling into subcategories

      const categoryContainer = document.getElementById('categoryContainer');
      const subcategoryContainer = document.getElementById('subcategoryContainer');
      let startX = 0;
      let currentX = 0;
      let isDragging = false;

      function showCategory(index) {
        const category = currentLevel[index];  // Get the category from the current level (either main or subcategory)

        const newCard = document.createElement('div');
        newCard.classList.add('category-card', 'absolute', 'inset-0', 'flex', 'justify-center', 'items-center', 'transition-transform', 'duration-500');
        newCard.innerHTML = `
          <div class="w-80 h-96 bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500">
            <img src="${category.image}" alt="${category.name}" class="w-full h-48 object-cover">
            <div class="p-4 text-center">
              <h3 class="text-lg font-bold">${category.name}</h3>
            </div>
          </div>
        `;

        categoryContainer.innerHTML = '';
        categoryContainer.appendChild(newCard);

        currentCardElement = newCard;
      }

      function handleSwipeGesture() {
        const diff = currentX - startX;
        const direction = diff > 0 ? 'right' : 'left';

        if (Math.abs(diff) > 100) {
          currentCardElement.style.transition = 'transform 0.5s ease-out';

          if (direction === 'left' && currentCategoryIndex < currentLevel.length - 1) {
            // Swipe left to show the next category
            currentCardElement.style.transform = 'translateX(-100%)';
            currentCategoryIndex++;
            setTimeout(() => {
              showCategory(currentCategoryIndex);
            }, 500);
          } else if (direction === 'left' && currentCategoryIndex === currentLevel.length - 1) {
            // If there's no next category on left swipe
            alert("No more categories to display.");
            currentCardElement.style.transform = 'translateX(0px)';
          } else if (direction === 'right') {
            const currentCategory = currentLevel[currentCategoryIndex];

            if (currentCategory.subcategories.length > 0) {
              // Swipe right to drill down into subcategories
              parentStack.push({ level: currentLevel, index: currentCategoryIndex });
              currentLevel = currentCategory.subcategories;
              currentCategoryIndex = 0;
              showCategory(currentCategoryIndex);
            } else if (parentStack.length > 0) {
              // Go back to parent category
              const parent = parentStack.pop();
              currentLevel = parent.level;
              currentCategoryIndex = parent.index;
              showCategory(currentCategoryIndex);
            } else {
              // If there's no parent and no subcategories on right swipe
              alert("No subcategories available.");
              currentCardElement.style.transform = 'translateX(0px)';
            }
          }
        } else {
          currentCardElement.style.transform = 'translateX(0px)';
        }

        isDragging = false;
        startX = 0;
        currentX = 0;
      }

      function onTouchStart(event) {
        startX = event.touches[0].clientX;
        isDragging = true;
      }

      function onTouchMove(event) {
        if (!isDragging) return;

        currentX = event.touches[0].clientX;
        const diff = currentX - startX;

        currentCardElement.style.transition = 'none';
        currentCardElement.style.transform = `translateX(${diff}px)`;
      }

      function onTouchEnd() {
        handleSwipeGesture();
      }

      categoryContainer.addEventListener('touchstart', onTouchStart, false);
      categoryContainer.addEventListener('touchmove', onTouchMove, false);
      categoryContainer.addEventListener('touchend', onTouchEnd, false);

      showCategory(currentCategoryIndex);  // Start by showing the first category
    }
  });
}