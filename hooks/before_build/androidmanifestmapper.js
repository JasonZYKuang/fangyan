#!/usr/bin/env node
var fs = require('fs');
var path = require('path');


try {
	
	var xpath = require('../utils/xpath');
	var dom = require('../utils/xmldom');

	var DOMParser = dom.DOMParser;

	var configXml = "../../config.xml";
	if(!fs.existsSync(path.resolve(__dirname,configXml))) {
		configXml = "../../www/config.xml";
	}
	var fileData = fs.readFileSync(path.resolve(__dirname,configXml), 'ascii');
	var doc = new DOMParser().parseFromString(fileData.substring(2, fileData.length));
	if(fs.existsSync(path.resolve(__dirname,"../../platforms/android/AndroidManifest.xml")) && !fs.existsSync(path.resolve(__dirname,"../../platforms/android/AndroidManifest.base.xml")))
		fs.renameSync(path.resolve(__dirname,"../../platforms/android/AndroidManifest.xml"),path.resolve(__dirname,"../../platforms/android/AndroidManifest.base.xml"));

	var androidManifestData = fs.readFileSync(path.resolve(__dirname,"../../platforms/android/AndroidManifest.base.xml"),'ascii');

	var manifestDoc = new DOMParser().parseFromString(androidManifestData.substring(2, androidManifestData.length));

	var select = xpath.useNamespaces({"gap": "http://phonegap.com/ns/1.0"});
	var nodes = select("//gap:config-file",doc);
	for(i=0;i<nodes.length;i++) {
		var type = typeof nodes[i];
		if (type == "object") {
			var platform = nodes[i].getAttribute('platform');
			if(platform != "android")
				continue;
			
			//get mode attribute
			var mode = nodes[i].getAttribute('mode');
			if(mode == null || mode.length == 0) {
				//treat as add
				mode = "add";
			} 
			//get parent attribute
			var parentNodeName = getParentNode(nodes[i]);
			
			var childs = nodes[i].childNodes;
			if(childs == null) continue;
			for(j=0;j<childs.length;j++) {
				//console.log(childs[j].localName);
				var nodeToCopy = childs[j];
				if(nodeToCopy.nodeType == 3) {
					continue;
				}
				updateAndroidManifest(mode, nodeToCopy, parentNodeName, manifestDoc);
			}
		}
	}
	//write the updated manifest 
	var writer = dom.XMLSerializer;
	var buf = new writer().serializeToString(manifestDoc);

	//to add newlines after every xml tag otherwise all new tags are appened to same line
	var reg = /(>)\s*(<)(\/*)/g;
	//buf = buf.replace(/\r|\n/g, ''); //deleting already existing whitespaces
	buf = buf.replace(reg, '$1\r\n$2$3');

	fs.writeFile(path.resolve(__dirname,"../../platforms/android/AndroidManifest.xml"), buf, function (err) {
		  if (err) throw err;
		  console.log('It\'s saved!');
		});

	function checkIfNodeExists(node,doc) {
		if(node.nodeType == 1) {
			var nodes = xpath.select("//"+node.nodeName,doc);
			if(nodes != null && nodes.length > 0) {
				return true;
			}
		}
		return false;	
	}

	function getParentNode(node) {
		var parent = node.getAttribute('parent'); 
		
		if(parent != null && parent.indexOf("/") == 0 && parent.length > 1) {
			parent = parent.substring(1, parent.length);
		}
		
		if(parent == null || parent.length == 0) {
			parent = "manifest";
		}
		
		return parent;
	}

	function updateAndroidManifest(mode,nodeToCopy,parentNodeName,manifestDoc) {
		switch(mode){
		case "add" : addChildNode(nodeToCopy, parentNodeName, manifestDoc);
					 return;
		case "merge" : mergeChildNode(nodeToCopy, parentNodeName, manifestDoc);
					return;
		case "replace" : replaceChildNode(nodeToCopy, parentNodeName, manifestDoc);
					return;
		case "delete" : deleteChildNode(nodeToCopy, parentNodeName, manifestDoc);
					return;
		} 
		
	}

	function addChildNode(node,parentNodeName,doc) {
		var parentNodes = xpath.select("//"+parentNodeName,doc);
		//get parent node from android manifest
		if(parentNodes != null && parentNodes.length > 0) {
			var parentNode = parentNodes[0];
			//add the node, its attributes and its children to the parent
			copyChild(node, parentNode, doc);
		}
	}

	function copyChild(node,parent,doc) {
		if(parent == null || node == null) return;
		if(node.nodeType == 3) {
			var textNode = doc.createTextNode(node.data);
			parent.appendChild(textNode);
			return;
		}
		var newChild = doc.createElement(node.nodeName);
		parent.appendChild(newChild);
		
		var attrs = node.attributes;
		if(attrs != null) {
			for (var i=0;i<attrs.length;i++) {
				newChild.setAttribute(attrs[i].name,attrs[i].value);
			}
		}
		
		
		var childs = node.childNodes;
		if(childs != null) {
			for (var j=0;j<childs.length;j++) {
				copyChild(childs[j], newChild, doc);
			}
		}
		
	}

	function replaceChildNode(node,parentNodeName,doc) {
		//get the parent node and remove all the childres and copy the node and its children
		var destNodes = xpath.select("//"+parentNodeName+"/"+node.nodeName,doc);
		//get parent node from android manifest
		if(destNodes != null && destNodes.length > 0) {
			var destNode = destNodes[0];
			//delete the dest node and copy the entire node from config.xml
			var destParent = destNode.parentNode;
			destParent.removeChild(destNode);
			//add the node, its attributes and its children to the parent
			copyChild(node, destParent, doc);
		}
	}

	function deleteChildNode(node,parentNodeName,doc) {
		//get the parent node and remove all the childres and copy the node and its children
		var destNodes = xpath.select("//"+parentNodeName+"/"+node.nodeName,doc);
		//get parent node from android manifest
		if(destNodes != null && destNodes.length > 0) {
			var destNode = destNodes[0];
			//match the attributes and then delete the node
			var attrs = node.attributes;
			for(var i=0; i<attrs.length;i++) {
				if(destNode.getAttributeNode(attrs[i].name) == null ||
						(destNode.getAttributeNode(attrs[i].name) != null && destNode.getAttributeNode(attrs[i].name).value != attrs[i].value)) {
					return;
				} 
				
			}
			destNode.parentNode.removeChild(destNode);
		}
	}

	function mergeChildNode(node,parentNodeName,doc) {
		//check if the node exists then update its attributes and repeat the same for the children.
		var destChildNode = getDestNode(node,parentNodeName,doc)
		if(destChildNode != null) {
			mergeChildAttributes(node, destChildNode, doc);
		} else {
			//dest node is not present hence simply copy the src node
			var parentNodes = xpath.select("//"+parentNodeName,doc);
			//get parent node from android manifest
			if(parentNodes == null && parentNodes.length <= 0) return;
				
			var parentNode = parentNodes[0];
			copyChild(node, parentNode, doc);
		}
		
	}

	function getDestNode(node,parentNodename,doc) {
		var destNodes = xpath.select("//"+parentNodeName+"/"+node.nodeName,doc);
		if(destNodes != null && destNodes.length > 0) {
			return destNodes[0];
		} 
		
		var parentNodes = xpath.select("//"+parentNodeName,doc);
		//get parent node from android manifest
		if(parentNodes != null && parentNodes.length > 0) {
			var parentNode = parentNodes[0];
			var newChild = doc.createElement(node.nodeValue);
			parentNode.appendChild(newChild);
			
			return newChild;
		}
		
		return null;
	}

	function mergeChildAttributes(srcNode,destNode,doc) {
		if(srcNode == null || destNode == null) return;
		if(srcNode.nodeName == destNode.nodeName && srcNode.nodeValue == destNode.nodeValue) {
			var attrs = srcNode.attributes;
			if(attrs != null) {
				for (var i=0;i<attrs.length;i++) {
					destNode.setAttribute(attrs[i].name,attrs[i].value);
				}
			}
			
			var childs = srcNode.childNodes;
			if(childs == null) return;
			for (var j=0;j<childs.length;j++) {
				if(childs[j].nodeType == 3) {
					continue;
				}
				//check for destnode
				var destChilds = destNode.getElementsByTagName(childs[j].nodeName);
				if(destChilds != null && destChilds.length > 0) {
					//if destnode present copy the attributes from source child node and copy child attributes
					mergeChildAttributes(childs[j], destChilds[0], doc);
				} else {
					//destnode is not present hence copy the entire node as is
					copyChild(childs[j], destNode, doc);
				}
			}
		}
		
	}
	
} catch (err) {
	console.log(err);
	if(!fs.existsSync(path.resolve(__dirname,"../../platforms/android/AndroidManifest.xml")) && fs.existsSync(path.resolve(__dirname,"../../platforms/android/AndroidManifest.base.xml"))) {
		
		fs.writeFile(path.resolve(__dirname,"../../platforms/android/AndroidManifest.xml"), fs.readFileSync(path.resolve(__dirname,"../../platforms/android/AndroidManifest.base.xml"),'ascii'), function (err) {
			  if (err) throw err;
			  //console.log('Unable to revert the original AndroidManifest.xml');
			});
		console.log("Reverted the android manifest");
	}
} finally {
	
}
