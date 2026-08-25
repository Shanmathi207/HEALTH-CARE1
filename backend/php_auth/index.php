<?php

header('Content-Type: application/json');

$pdo = require __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

/*
|--------------------------------------------------------------------------
| Get requested URL
|--------------------------------------------------------------------------
*/

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

/*
|--------------------------------------------------------------------------
| Find php_auth folder in URL
|--------------------------------------------------------------------------
*/

$phpAuthPosition = strpos($requestUri, '/php_auth');

if ($phpAuthPosition !== false) {

    $route = substr(
        $requestUri,
        $phpAuthPosition + strlen('/php_auth')
    );

} else {

    $route = '';
}

$route = trim($route, '/');


/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
|
| http://localhost/HEALTH-CARE(1)/HEALTH-CARE-main/backend/php_auth/
|
*/

if ($route === '' || $route === 'index.php') {

    echo json_encode([
        'message' => 'PHP Auth Service Running',
        'status' => 'success'
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| USERS API ROUTE
|--------------------------------------------------------------------------
|
| /php_auth/users
|
| IMPORTANT:
| This is only the API route.
| Database table is still "health".
|
*/

if ($route !== 'users' && $route !== 'users/index.php') {

    http_response_code(404);

    echo json_encode([
        'error' => 'Not found',
        'route_received' => $route
    ]);

    exit;
}


try {

    /*
    |--------------------------------------------------------------------------
    | GET /users
    |--------------------------------------------------------------------------
    */

    if ($method === 'GET') {

        $email = $_GET['email'] ?? null;


        /*
        | Get one user
        */

        if ($email) {

            $stmt = $pdo->prepare(
                'SELECT
                    id,
                    email,
                    password,
                    user_type,
                    name,
                    phone,
                    specialization,
                    department,
                    hospital_name,
                    created_at
                 FROM health
                 WHERE email = :email
                 LIMIT 1'
            );

            $stmt->execute([
                'email' => $email
            ]);

            $user = $stmt->fetch();


            if (!$user) {

                echo json_encode([]);

                exit;
            }


            /*
            | Convert MySQL names to Node.js names
            */

            $user['userType'] = $user['user_type'];
            $user['hospitalName'] = $user['hospital_name'];
            $user['createdAt'] = $user['created_at'];


            unset($user['user_type']);
            unset($user['hospital_name']);
            unset($user['created_at']);


            echo json_encode($user);

            exit;
        }


        /*
        | Get all users
        */

        $stmt = $pdo->query(
            'SELECT
                id,
                email,
                password,
                user_type,
                name,
                phone,
                specialization,
                department,
                hospital_name,
                created_at
             FROM health'
        );

        $users = $stmt->fetchAll();


        foreach ($users as &$user) {

            $user['userType'] = $user['user_type'];
            $user['hospitalName'] = $user['hospital_name'];
            $user['createdAt'] = $user['created_at'];

            unset($user['user_type']);
            unset($user['hospital_name']);
            unset($user['created_at']);
        }


        echo json_encode($users);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | POST /users
    |--------------------------------------------------------------------------
    |
    | Used by Node.js registration
    |
    */

    if ($method === 'POST') {

        $input = json_decode(
            file_get_contents('php://input'),
            true
        );


        /*
        | Validate JSON
        */

        if (!is_array($input)) {

            http_response_code(400);

            echo json_encode([
                'error' => 'Invalid JSON data'
            ]);

            exit;
        }


        /*
        | Validate email and password
        */

        if (
            empty($input['email']) ||
            empty($input['password'])
        ) {

            http_response_code(400);

            echo json_encode([
                'error' => 'Missing email or password'
            ]);

            exit;
        }


        /*
        | Get values
        */

        $email = $input['email'];

        $password = $input['password'];

        $userType =
            $input['userType']
            ?? $input['user_type']
            ?? null;

        $name =
            $input['name']
            ?? null;

        $phone =
            $input['phone']
            ?? null;

        $specialization =
            $input['specialization']
            ?? null;

        $department =
            $input['department']
            ?? null;

        $hospitalName =
            $input['hospitalName']
            ?? $input['hospital_name']
            ?? null;


        /*
        |--------------------------------------------------------------------------
        | Check whether email already exists
        |--------------------------------------------------------------------------
        */

        $check = $pdo->prepare(
            'SELECT id
             FROM health
             WHERE email = :email
             LIMIT 1'
        );

        $check->execute([
            'email' => $email
        ]);

        $existingUser = $check->fetch();


        /*
        |--------------------------------------------------------------------------
        | UPDATE existing user
        |--------------------------------------------------------------------------
        */

        if ($existingUser) {

            $stmt = $pdo->prepare(
                'UPDATE health
                 SET
                    password = :password,
                    user_type = :user_type,
                    name = :name,
                    phone = :phone,
                    specialization = :specialization,
                    department = :department,
                    hospital_name = :hospital_name
                 WHERE email = :email'
            );

            $stmt->execute([

                'email' => $email,

                'password' => $password,

                'user_type' => $userType,

                'name' => $name,

                'phone' => $phone,

                'specialization' => $specialization,

                'department' => $department,

                'hospital_name' => $hospitalName
            ]);

        }


        /*
        |--------------------------------------------------------------------------
        | INSERT new user
        |--------------------------------------------------------------------------
        */

        else {

            $stmt = $pdo->prepare(
                'INSERT INTO health
                (
                    email,
                    password,
                    user_type,
                    name,
                    phone,
                    specialization,
                    department,
                    hospital_name
                )
                VALUES
                (
                    :email,
                    :password,
                    :user_type,
                    :name,
                    :phone,
                    :specialization,
                    :department,
                    :hospital_name
                )'
            );

            $stmt->execute([

                'email' => $email,

                'password' => $password,

                'user_type' => $userType,

                'name' => $name,

                'phone' => $phone,

                'specialization' => $specialization,

                'department' => $department,

                'hospital_name' => $hospitalName
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Get saved user
        |--------------------------------------------------------------------------
        */

        $stmt = $pdo->prepare(
            'SELECT
                id,
                email,
                password,
                user_type,
                name,
                phone,
                specialization,
                department,
                hospital_name,
                created_at
             FROM health
             WHERE email = :email
             LIMIT 1'
        );

        $stmt->execute([
            'email' => $email
        ]);

        $saved = $stmt->fetch();


        if ($saved) {

            $saved['userType'] =
                $saved['user_type'];

            $saved['hospitalName'] =
                $saved['hospital_name'];

            $saved['createdAt'] =
                $saved['created_at'];


            unset($saved['user_type']);
            unset($saved['hospital_name']);
            unset($saved['created_at']);


            echo json_encode($saved);

        } else {

            http_response_code(500);

            echo json_encode([
                'error' => 'User was not saved'
            ]);
        }

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE /users
    |--------------------------------------------------------------------------
    */

    if ($method === 'DELETE') {

        $pdo->exec(
            'DELETE FROM health'
        );

        echo json_encode([
            'deleted' => true
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Unsupported method
    |--------------------------------------------------------------------------
    */

    http_response_code(405);

    echo json_encode([
        'error' => 'Method not allowed'
    ]);

    exit;


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);

    exit;


} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'error' => 'Server error',
        'message' => $e->getMessage()
    ]);

    exit;
}

?>