# Goify
Tranforms JSON(JS) objects to Go structs.

## Usage
```sh
node index.js [...flags] file
```
**Note**: The root object cannot be a array.
### Flags
* `-std/--stdin` - take input from stdin rather then the last arg as a file.
* `-t/--tabs` - use tabs rather then spaces
* `-s/--spaces <number>` - set the amount of spaces
* `-p/--private` - make the entries go private(lower case)


# License
this is free software under GPL 2.0
