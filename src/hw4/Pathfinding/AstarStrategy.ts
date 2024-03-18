import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";

// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */

interface nodeInfo {
    node: number;
    gscore: number;
    hscore: number;
    parent: number;
}

function findNode(node: number, set) {
    for (const node of set) {
      if (node.node === node) {
        return node;
      }
    }
    return undefined;
  }

function h(start: number, end: number, mesh) {
    // console.log("bleh: ", mesh.graph.getNodePosition(start));
    return mesh.graph.getNodePosition(start).distanceTo(mesh.graph.getNodePosition(end));
}


export default class AstarStrategy extends NavPathStrat {
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        const start = this.mesh.graph.snap(from);
        const target = this.mesh.graph.snap(to);

        let parents = new Map<number, number>();
        let gscore = new Map<number, number>();
        let hscore = new Map<number, number>();
        gscore.set(start, 0);
        hscore.set(start, h(start, target, this.mesh));
        let closedset = new Set<number>();
        let openset = new Set<number>();
        openset.add(start);
        console.log("start: ", start);
        console.log("target: ", target);
        while (openset.size > 0) {
            let curr = Array.from(openset).reduce((a, b) => {
                return (gscore.get(a) + hscore.get(a)) < (gscore.get(b) + hscore.get(b)) ? a : b;
            });

            // console.log("curr: ", curr);
            openset.delete(curr);
            closedset.add(curr);
            
            if (curr == target) {

                break;
            }

            let edges = this.mesh.graph.edges[curr];
            // console.log("edge: ", edges);
            while (edges != null && edges !== undefined) {
                // console.log("edge: ", edges);
                let neighbor = edges.y;
                // console.log("neighbor: ", edges);
                let tentative_gscore = gscore.get(curr) + edges.weight;
                
                if (closedset.has(neighbor)) {
                    edges = edges.next;
                    continue;
                }
                
                if(openset.has(neighbor)) {
                    if(tentative_gscore < gscore.get(neighbor)) {
                        gscore.set(neighbor, tentative_gscore);
                        parents.set(neighbor, curr);
                    }
                } else{
                    openset.add(neighbor);
                    gscore.set(neighbor, tentative_gscore);
                    parents.set(neighbor, curr);

                    hscore.set(neighbor, h(neighbor, target, this.mesh));
                }
                // console.log("neighbor: ", this.mesh.graph.getNodePosition(neighbor).distanceTo(this.mesh.graph.getNodePosition(target)));
                edges = edges.next;
            }
        }
        // Reconstruct path
        let path = new Stack<Vec2>(this.mesh.graph.numVertices);
        let current = target;
        while (parents.has(current)) {
            path.push(this.mesh.graph.getNodePosition(current));
            current = parents.get(current);
            // console.log("curr:", current);
        }
        console.log("breh");
        path.push(from); // Add start node
        return new NavigationPath(path);
    }
}